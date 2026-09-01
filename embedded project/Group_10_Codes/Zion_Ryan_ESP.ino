#include <Wire.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include "esp_wifi.h"

// ========================
// I2C ADDRESSES
// ========================
#define MSP_ADDR  0x08
#define MPU_ADDR  0x68

// ESP32-S3 I2C pins
#define SDA_PIN 1
#define SCL_PIN 2

// Ultrasonic pins
#define TRIG_PIN 8
#define ECHO_PIN 6

// Button (FireBeetle ESP32-S3 D3 = GPIO 3)
#define WAKE_BUTTON_PIN 3

BLEServer* pServer = nullptr;
BLECharacteristic* pTx = nullptr;

bool deviceConnected = false;

enum Mode { MANUAL, FOLLOW_ME, SLEEPING };
Mode currentMode = MANUAL;

char lastCmdSent = 'S';
unsigned long lastCmd = 0;

// ========================
// IMU VARIABLES
// ========================
float yaw_deg = 0.0f;
float lastGz = 0.0f;
unsigned long lastUs = 0;
int16_t gyroZOffset = 0;

bool turning = false;
float turnStartYaw = 0;
float turnTargetDelta = 6.5f;


// ======================================================
// BLE-SAFE SLEEP MODE
// ======================================================
void enterSafeSleep()
{
  Serial.println("💤 Enter BLE-safe idle mode...");
  esp_wifi_set_ps(WIFI_PS_MIN_MODEM);
  setCpuFrequencyMhz(80);
}

void wakeSafeSleep()
{
  Serial.println("🔔 Waking from BLE-safe mode!");

  setCpuFrequencyMhz(240);
  esp_wifi_set_ps(WIFI_PS_NONE);

  currentMode = MANUAL;
  turning = false;
  yaw_deg = 0;
  turnStartYaw = 0;

  sendMSP('W');
  lastCmd = millis();
}


// ======================================================
// SEND MSP COMMAND
// ======================================================
void sendMSP(char c) {
  Wire.beginTransmission(MSP_ADDR);
  Wire.write(c);
  Wire.endTransmission(true);
  lastCmdSent = c;
}


// ======================================================
// MPU FUNCTIONS
// ======================================================
void mpuWrite(uint8_t reg, uint8_t data) {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(reg);
  Wire.write(data);
  Wire.endTransmission(true);
}

int16_t readGyroZ() {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x47);
  Wire.endTransmission(false);

  Wire.requestFrom(MPU_ADDR, 2u, true);
  if (Wire.available() == 2) {
    return (Wire.read() << 8) | Wire.read();
  }
  return 0;
}

void calibrateGyro() {
  long sum = 0;
  Serial.println("🧭 Calibrating gyro...");
  delay(300);

  for (int i = 0; i < 400; i++) {
    sum += readGyroZ();
    delay(3);
  }

  gyroZOffset = sum / 400;
  Serial.printf("✔ Gyro offset: %d\n", gyroZOffset);
}


// ======================================================
// BLE CALLBACKS
// ======================================================
class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer*) override {
    deviceConnected = true;
    wakeSafeSleep();
    Serial.println("📶 BLE Connected");
  }
  
  void onDisconnect(BLEServer*) override {
    deviceConnected = false;
    Serial.println("❌ BLE Disconnected");
  }
};

class MyRxCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *ch) override {

    String rx = ch->getValue();
    if (!rx.length()) return;

    char c = rx.charAt(0);
    lastCmd = millis();

    Serial.printf("📩 RX: %c\n", c);

    if (c == '1') { turning = false; currentMode = MANUAL; sendMSP('S'); return; }
    if (c == '2') { turning = false; currentMode = FOLLOW_ME; sendMSP('S'); return; }

    if (c == 'W') { wakeSafeSleep(); return; }

    if (c == 'Z') {
      currentMode = SLEEPING;
      sendMSP('Z');
      enterSafeSleep();
      return;
    }

    if (currentMode != MANUAL) return;

    if (c == 'S') {
      turning = false;
      sendMSP('S');
      yaw_deg = 0;
      turnStartYaw = 0;
      return;
    }

    if (c == 'L' || c == 'R') {
      turning = true;
      turnStartYaw = yaw_deg;
      sendMSP(c);
      return;
    }

    if (c == 'F' || c == 'B') {
      turning = false;
      sendMSP(c);
      return;
    }
  }
};


// ======================================================
// ULTRASONIC
// ======================================================
float getDistance() {
  digitalWrite(TRIG_PIN, LOW); delayMicroseconds(5);
  digitalWrite(TRIG_PIN, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  unsigned long t = pulseIn(ECHO_PIN, HIGH, 30000);
  if (t == 0) return -1;

  return t * 0.0343 / 2;
}


// ======================================================
// SETUP
// ======================================================
void setup() {
  Serial.begin(115200);

  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.setClock(100000);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(WAKE_BUTTON_PIN, INPUT_PULLUP);

  // IMU
  mpuWrite(0x6B, 0x00);
  calibrateGyro();

  // BLE INIT
  BLEDevice::init("ESP32S3_FollowReverse");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *service =
    pServer->createService("6E400001-B5A3-F393-E0A9-E50E24DCCA9E");

  pTx = service->createCharacteristic(
    "6E400003-B5A3-F393-E0A9-E50E24DCCA9E",
    BLECharacteristic::PROPERTY_NOTIFY);
  pTx->addDescriptor(new BLE2902());

  BLECharacteristic *rx =
    service->createCharacteristic(
      "6E400002-B5A3-F393-E0A9-E50E24DCCA9E",
      BLECharacteristic::PROPERTY_WRITE);
  rx->setCallbacks(new MyRxCallbacks());

  service->start();
  pServer->getAdvertising()->start();

  lastUs = micros();

  esp_wifi_set_ps(WIFI_PS_NONE);
}


// ======================================================
// MAIN LOOP
// ======================================================
void loop() {

  // ===== BUTTON WAKE =====
  if (digitalRead(WAKE_BUTTON_PIN) == LOW) {
      delay(30);
      if (digitalRead(WAKE_BUTTON_PIN) == LOW && currentMode == SLEEPING) {
          Serial.println("🔘 Button wake!");
          wakeSafeSleep();
      }
  }

  // ===== READ IMU =====
  int16_t rawZ = readGyroZ();
  lastGz = (rawZ - gyroZOffset) / 131.0f;

  unsigned long nowUs = micros();
  float dt = (nowUs - lastUs) * 1e-6;
  lastUs = nowUs;

  yaw_deg += lastGz * dt;

  // ===== TURNING LOGIC =====
  if (turning) {
      float delta = fabs(yaw_deg - turnStartYaw);

      Serial.printf("🔄 Turning... yaw=%.2f°, Δ=%.2f°\n", yaw_deg, delta);

      if (delta >= turnTargetDelta) {
          Serial.printf("✅ Turn complete! Total Δyaw = %.2f°\n", delta);

          sendMSP('S');
          turning = false;

          yaw_deg = 0;
          turnStartYaw = 0;

          Serial.println("🟢 Yaw reset after turn complete");
      }
  }

  // ======================================================
  // PRINT ULTRASONIC ALWAYS (ONLY CHANGE YOU REQUESTED)
  // ======================================================
  float dist = getDistance();
  if (dist > 0) Serial.printf("📡 Ultrasonic: %.1f cm\n", dist);
  else Serial.println("📡 Ultrasonic: ---");


  // ===== FOLLOW-ME MODE =====
  if (deviceConnected && currentMode == FOLLOW_ME && !turning) {

    // NEW RANGE: 20–100 cm = forward
    char cmd = 'S';

    if (dist > 20 && dist < 100) cmd = 'F';
    else if (dist <= 10 && dist >= 0) cmd = 'B';

    if (cmd != lastCmdSent) {
      sendMSP(cmd);
      lastCmdSent = cmd;

      if (cmd == 'S') {
        yaw_deg = 0;
        turnStartYaw = 0;
      }
    }
  }

  // ===== AUTO SLEEP =====
  if (millis() - lastCmd >= 30000 && currentMode != SLEEPING) {

      Serial.println("😴 Auto BLE-safe sleep");
      currentMode = SLEEPING;

      sendMSP('Z');
      enterSafeSleep();
  }

  delay(10);
}

