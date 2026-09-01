#include "ee.h"
#include "Arduino.h"
#include "hwpins.h"

#include <math.h>
#include <stdio.h>

#include "ServoTimer2.h"
#include "LiquidCrystal.h"

// [Zion] contribution - LCD external references
extern LiquidCrystal lcd;
extern LiquidCrystal lcd2;

extern "C" {

/* ---------------- RTOS Declarations ---------------- */

// [Daryl] contribution - Task declarations
DeclareTask(SensorTask);
DeclareTask(ServoControlTask);
DeclareTask(LEDControlTask);
DeclareTask(DisplayTask);
DeclareTask(ClockTask);

// [Daryl] contribution - Resource declarations
DeclareResource(SensorDataRes);
DeclareResource(ServoControlRes);
DeclareResource(LEDControlRes);
DeclareResource(DisplayRes);

// [Daryl] contribution - Event declarations
DeclareEvent(ServoCommandEvent);
DeclareEvent(LEDCommandEvent);

/* ---------------- Forward Declarations ---------------- */

// [Ryan] contribution - Servo function declarations
static void servos_init(void);
static void servos_update(void);
static void servos_set_target(int west_target_value, int east_target_value);

// [Rein] contribution - LED function declaration
static void leds_update(void);

// [Valerie] contribution - Sensor function declarations
static uint16_t adc_to_lux(int adc);
static uint16_t smooth_lux(uint16_t new_value, uint16_t old_value);

// [Rein] contribution - Clock function declaration
static bool is_night_time(void);

/* ---------------- SERVO Management ---------------- */
// [Ryan] contribution - All servo variables and functions

static ServoTimer2 servoW;
static ServoTimer2 servoE;

static int west_pos = 750;
static int east_pos = 750;
static int west_target = 750;
static int east_target = 750;

static bool servos_initialized = false;

static void servos_init(void)
{
    if(!servos_initialized)
    {
        servoW.attach(SERVO_WEST_PIN);
        servoE.attach(SERVO_EAST_PIN);
        servos_initialized = true;
    }
}

/* Smooth servo movement (non-blocking) */
static void servos_update(void)
{
    GetResource(ServoControlRes);

    if(west_pos < west_target) west_pos += 15;
    if(west_pos > west_target) west_pos -= 15;

    if(east_pos < east_target) east_pos += 15;
    if(east_pos > east_target) east_pos -= 15;

    servoW.write(west_pos);
    servoE.write(east_pos);

    ReleaseResource(ServoControlRes);
}

static void servos_set_target(int west_target_value, int east_target_value)
{
    GetResource(ServoControlRes);
    west_target = west_target_value;
    east_target = east_target_value;
    ReleaseResource(ServoControlRes);
}

/* ---------------- Sensor Data Structure ---------------- */
// [Valerie] contribution - SensorData struct definition

typedef struct
{
    uint16_t lux_west;
    uint16_t lux_east;
    uint16_t avg_lux;
    uint16_t raw_adc_west;
    uint16_t raw_adc_east;
    bool data_valid;

    uint8_t west_light;   /* actual current LED state */
    uint8_t east_light;   /* actual current LED state */

    uint8_t west_shade;
    uint8_t east_shade;
} SensorData;

static SensorData g_sensor_data = {0};

/* ---------------- Clock Variables ---------------- */
// [Rein] contribution - Clock variables and night detection
/* Change these 3 values if you want a different start time */
static int hours = 7;
static int minutes = 29;
static int seconds = 30;

/* Night mode: 18:30:00 to next day 07:29:59 */
static bool is_night_time(void)
{
    if(hours > 18) return true;
    if(hours == 18 && minutes >= 30) return true;

    if(hours < 7) return true;
    if(hours == 7 && minutes < 30) return false;

    return false;
}

/* ---------------- LED Control ---------------- */
// [Rein] contribution - LED control function

static void leds_update(void)
{
    GetResource(LEDControlRes);
    GetResource(SensorDataRes);

    uint8_t west_light = 0;
    uint8_t east_light = 0;

    /* Time-based rule only */
    if(is_night_time())
    {
        west_light = 1;
        east_light = 1;
    }
    else
    {
        west_light = (g_sensor_data.lux_west <= 200) ? 1 : 0;
        east_light = (g_sensor_data.lux_east <= 200) ? 1 : 0;
    }

    digitalWrite(LED_WEST_PIN, west_light ? HIGH : LOW);
    digitalWrite(LED_EAST_PIN, east_light ? HIGH : LOW);

    /* Save actual LED output state so LCD shows real current state */
    g_sensor_data.west_light = west_light;
    g_sensor_data.east_light = east_light;

    ReleaseResource(SensorDataRes);
    ReleaseResource(LEDControlRes);
}

/* ---------------- ADC to LUX Conversion ---------------- */
// [Valerie] contribution - ADC to Lux conversion and smoothing

static uint16_t adc_to_lux(int adc)
{
    if(adc <= 0) return 999;

    double v5k = ((double)adc / 1023.0) * 5.0;
    if(v5k < 0.001) v5k = 0.001;

    double vldr = 5.0 - v5k;
    double rldr = (vldr / v5k) * 5000.0;

    if(rldr < 1.0) rldr = 1.0;

    double lux = 889985.88 * pow(rldr, -1.16552);

    if(lux < 1) lux = 1;
    if(lux > 999) lux = 999;

    return (uint16_t)(lux + 0.5);
}

static uint16_t smooth_lux(uint16_t new_value, uint16_t old_value)
{
    return (new_value + old_value) / 2;
}

/* ---------------- LCD Display Functions ---------------- */
// [Zion] contribution - LCD display functions

static void display_main_screen(SensorData s)
{
    char buf[21];

    /* Row 1: Lux values */
    sprintf(buf, "W:%3d E:%3d Avg:%3d",
            s.lux_west, s.lux_east, s.avg_lux);
    lcd.setCursor(0, 0);
    lcd.print(buf);
    lcd.print("   ");

    /* Row 2: Shade status */
    sprintf(buf, "Shade W:%s E:%s",
            s.west_shade ? "OPN" : "CLS",
            s.east_shade ? "OPN" : "CLS");
    lcd.setCursor(0, 1);
    lcd.print(buf);
    lcd.print("      ");

    /* Row 3: Actual LED states */
    sprintf(buf, "Light W:%s E:%s",
            s.west_light ? "ON" : "OFF",
            s.east_light ? "ON" : "OFF");
    lcd.setCursor(0, 2);
    lcd.print(buf);
    lcd.print("   ");

    /* Row 4: 24-hour clock */
    sprintf(buf, "Time %02d:%02d:%02d",
            hours, minutes, seconds);
    lcd.setCursor(0, 3);
    lcd.print(buf);
    lcd.print("     ");
}

static void display_sun_tracker(SensorData s)
{
    char buf[21];
    int diff = (int)s.lux_west - (int)s.lux_east;

    const char* arrow;
    const char* position;

    if(diff > 50)
    {
        arrow = "<-- SUN";
        position = "WEST";
    }
    else if(diff < -50)
    {
        arrow = "SUN -->";
        position = "EAST";
    }
    else
    {
        arrow = "SUN CENTER";
        position = "CENTER";
    }

    lcd2.setCursor(0, 0);
    lcd2.print("Sun Tracker       ");

    lcd2.setCursor(0, 1);
    lcd2.print(arrow);
    lcd2.print("             ");

    sprintf(buf, "Pos:%s D:%d", position, diff);
    lcd2.setCursor(0, 2);
    lcd2.print(buf);
    lcd2.print("        ");

    sprintf(buf, "Night:%s",
            is_night_time() ? "ON " : "OFF");
    lcd2.setCursor(0, 3);
    lcd2.print(buf);
    lcd2.print("            ");
}

/* ---------------- TASK 1: Sensor Task ---------------- */
// [Valerie] contribution - SensorTask implementation

TASK(SensorTask)
{
    int adc_west = analogRead(LDR_WEST_PIN);
    int adc_east = analogRead(LDR_EAST_PIN);

    uint16_t lux_w = adc_to_lux(adc_west);
    uint16_t lux_e = adc_to_lux(adc_east);

    GetResource(SensorDataRes);

    lux_w = smooth_lux(lux_w, g_sensor_data.lux_west);
    lux_e = smooth_lux(lux_e, g_sensor_data.lux_east);

    g_sensor_data.lux_west = lux_w;
    g_sensor_data.lux_east = lux_e;
    g_sensor_data.avg_lux = (lux_w + lux_e) / 2;
    g_sensor_data.raw_adc_west = adc_west;
    g_sensor_data.raw_adc_east = adc_east;
    g_sensor_data.data_valid = true;

    ReleaseResource(SensorDataRes);

    SetEvent(ServoControlTask, ServoCommandEvent);
    SetEvent(LEDControlTask, LEDCommandEvent);

    TerminateTask();
}

/* ---------------- TASK 2: Servo Control Task ---------------- */
// [Ryan] contribution - ServoControlTask implementation

TASK(ServoControlTask)
{
    EventMaskType mask;

    servos_init();

    for(;;)
    {
        WaitEvent(ServoCommandEvent);
        GetEvent(ServoControlTask, &mask);

        if(mask & ServoCommandEvent)
        {
            GetResource(SensorDataRes);
            uint16_t west_lux = g_sensor_data.lux_west;
            uint16_t east_lux = g_sensor_data.lux_east;

            uint8_t west_shade = (west_lux >= 500) ? 1 : 0;
            uint8_t east_shade = (east_lux >= 500) ? 1 : 0;

            g_sensor_data.west_shade = west_shade;
            g_sensor_data.east_shade = east_shade;

            ReleaseResource(SensorDataRes);

            int west_target_value = west_shade ? 2250 : 750;
            int east_target_value = east_shade ? 2250 : 750;

            servos_set_target(west_target_value, east_target_value);
            servos_update();

            ClearEvent(ServoCommandEvent);
        }
    }
}

/* ---------------- TASK 3: LED Control Task ---------------- */
// [Rein] contribution - LEDControlTask implementation

TASK(LEDControlTask)
{
    EventMaskType mask;

    for(;;)
    {
        WaitEvent(LEDCommandEvent);
        GetEvent(LEDControlTask, &mask);

        if(mask & LEDCommandEvent)
        {
            leds_update();
            ClearEvent(LEDCommandEvent);
        }
    }
}

/* ---------------- TASK 4: Display Task ---------------- */
// [Zion] contribution - DisplayTask implementation

TASK(DisplayTask)
{
    SensorData local_data = {0};

    GetResource(SensorDataRes);
    if(g_sensor_data.data_valid)
    {
        local_data = g_sensor_data;
    }
    ReleaseResource(SensorDataRes);

    GetResource(DisplayRes);
    display_main_screen(local_data);
    display_sun_tracker(local_data);
    ReleaseResource(DisplayRes);

    TerminateTask();
}

/* ---------------- TASK 5: Clock Task ---------------- */
// [Zion] contribution - ClockTask implementation
/*
   This task should be activated once every 1 second by your OIL alarm.
   Each activation increments the 24-hour clock and refreshes LED state.
*/

TASK(ClockTask)
{
    seconds++;

    if(seconds >= 60)
    {
        seconds = 0;
        minutes++;
    }

    if(minutes >= 60)
    {
        minutes = 0;
        hours++;
    }

    if(hours >= 24)
    {
        hours = 0;
    }

    /* Update LEDs whenever time changes */
    SetEvent(LEDControlTask, LEDCommandEvent);

    TerminateTask();
}

} /* extern "C" */