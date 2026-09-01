#include "ee.h"
#include "Arduino.h"
#include "hwpins.h"
#include "LiquidCrystal.h"

// [Zion] contribution - LCD object creation
/* LCD 1 - Main Display */
LiquidCrystal lcd(LCD_RS_PIN, LCD_EN_PIN,
                  LCD_D4_PIN, LCD_D5_PIN,
                  LCD_D6_PIN, LCD_D7_PIN);

/* LCD 2 - Sun Tracker Display */
LiquidCrystal lcd2(LCD2_RS_PIN, LCD2_EN_PIN,
                   LCD2_D4_PIN, LCD2_D5_PIN,
                   LCD2_D6_PIN, LCD2_D7_PIN);

extern "C" {

/* Alarm declarations */
// [Daryl] contribution - Alarm declarations
DeclareAlarm(SensorAlarm);
DeclareAlarm(DisplayAlarm);

// [Daryl] contribution - Stack tracking variable
OsEE_addr volatile main_sp = 0;

/* ---------------- STARTUP HOOK ---------------- */

void StartupHook(void)
{
    // [Rein] contribution - LED initialization
    /* Initialize LED pins */
    pinMode(LED_WEST_PIN, OUTPUT);
    pinMode(LED_EAST_PIN, OUTPUT);

    /* Ensure LEDs are off initially */
    digitalWrite(LED_WEST_PIN, LOW);
    digitalWrite(LED_EAST_PIN, LOW);

    // [Zion] contribution - LCD initialization and welcome screens
    /* Initialize LCD displays */
    lcd.begin(20, 4);
    lcd2.begin(20, 4);

    lcd.clear();
    lcd2.clear();

    /* Welcome screen on main LCD */
    lcd.setCursor(0, 0);
    lcd.print("Bus-Stop Shade");
    lcd.setCursor(0, 1);
    lcd.print("& Street Light");
    lcd.setCursor(0, 2);
    lcd.print("Controller Sys");
    lcd.setCursor(0, 3);
    lcd.print("v2.0 - 5 Tasks");

    /* Welcome screen on sun tracker LCD */
    lcd2.setCursor(0, 0);
    lcd2.print("Sun Tracker");
    lcd2.setCursor(0, 1);
    lcd2.print("System Ready");
    lcd2.setCursor(0, 2);
    lcd2.print("5-Task OSEK");

    delay(2000);

    lcd.clear();
    lcd2.clear();

    // [Zion] contribution - Alarm setup
    /* Set up periodic alarms */
    SetRelAlarm(SensorAlarm, 10, 100);      /* Sensor task every 100ms */
    SetRelAlarm(DisplayAlarm, 20, 500);     /* Display task every 500ms */
}

/* ---------------- IDLE HOOK ---------------- */

// [Daryl] contribution - Idle hook for stack monitoring
void idle_hook(void)
{
    OsEE_addr volatile curr_sp = osEE_get_SP();

    if(main_sp == 0) {
        main_sp = curr_sp;
    }
}

/* ---------------- SETUP ---------------- */

// [Valerie] contribution - Serial debugging setup
void setup(void)
{
    Serial.begin(115200);
    /* Serial communication for debugging if needed */
}

/* ---------------- MAIN ---------------- */

// [Daryl] contribution - Main entry point
int main(void)
{
    init();
    setup();
    StartOS(OSDEFAULTAPPMODE);
    return 0;
}

} /* extern "C" */