import time
import threading
import pigpio
from gpiozero import LED

from config import (
    WINDOW_SERVO_1,
    WINDOW_SERVO_2,
    DOOR_SERVO,
    FAN_SERVO,
    LED1_PIN,
    LED2_PIN,
    LED3_PIN,
    SERVO_MIN_US,
    SERVO_MAX_US,
    WINDOW_CLOSED_ANGLE,
    WINDOW_OPEN_ANGLE,
    DOOR_CLOSED_ANGLE,
    DOOR_OPEN_ANGLE,
    FAN_OFF_ANGLE,
    FAN_LEFT_ANGLE,
    FAN_RIGHT_ANGLE,
)
from state import state_lock, system_state


pi = pigpio.pi()
if not pi.connected:
    raise RuntimeError("Could not connect to pigpio daemon. Run: sudo systemctl start pigpiod")

led1 = LED(LED1_PIN)
led2 = LED(LED2_PIN)
led3 = LED(LED3_PIN)

fan_thread = None
fan_stop_event = threading.Event()


def angle_to_pulsewidth(angle: int) -> int:
    angle = max(0, min(180, angle))
    return int(SERVO_MIN_US + (angle / 180.0) * (SERVO_MAX_US - SERVO_MIN_US))


def set_servo_angle(gpio_pin: int, angle: int):
    pulse = angle_to_pulsewidth(angle)
    pi.set_servo_pulsewidth(gpio_pin, pulse)
    time.sleep(0.6)
    pi.set_servo_pulsewidth(gpio_pin, 0)


def set_servo_angle_hold(gpio_pin: int, angle: int):
    pulse = angle_to_pulsewidth(angle)
    pi.set_servo_pulsewidth(gpio_pin, pulse)


def set_window(open_window: bool):
    angle = WINDOW_OPEN_ANGLE if open_window else WINDOW_CLOSED_ANGLE

    # If second servo is mounted opposite direction, change this to:
    # servo2_angle = 180 - angle
    servo2_angle = angle

    set_servo_angle(WINDOW_SERVO_1, angle)
    set_servo_angle(WINDOW_SERVO_2, servo2_angle)

    with state_lock:
        system_state["window"] = "open" if open_window else "closed"


def set_door(open_door: bool):
    angle = DOOR_OPEN_ANGLE if open_door else DOOR_CLOSED_ANGLE
    set_servo_angle(DOOR_SERVO, angle)

    with state_lock:
        system_state["door"] = "open" if open_door else "closed"


def set_light(on: bool):
    if on:
        led1.on()
        led2.on()
        led3.on()
    else:
        led1.off()
        led2.off()
        led3.off()

    with state_lock:
        system_state["light"] = "on" if on else "off"


def fan_swing_loop():
    while not fan_stop_event.is_set():
        set_servo_angle_hold(FAN_SERVO, FAN_LEFT_ANGLE)
        time.sleep(0.5)

        if fan_stop_event.is_set():
            break

        set_servo_angle_hold(FAN_SERVO, FAN_RIGHT_ANGLE)
        time.sleep(0.5)

    set_servo_angle_hold(FAN_SERVO, FAN_OFF_ANGLE)
    time.sleep(0.3)
    pi.set_servo_pulsewidth(FAN_SERVO, 0)


def set_fan(on: bool):
    global fan_thread

    if on:
        with state_lock:
            system_state["fan"] = "on"

        if fan_thread is None or not fan_thread.is_alive():
            fan_stop_event.clear()
            fan_thread = threading.Thread(target=fan_swing_loop, daemon=True)
            fan_thread.start()

    else:
        with state_lock:
            system_state["fan"] = "off"

        fan_stop_event.set()


def cleanup():
    global fan_thread

    fan_stop_event.set()

    led1.off()
    led2.off()
    led3.off()

    pi.set_servo_pulsewidth(WINDOW_SERVO_1, 0)
    pi.set_servo_pulsewidth(WINDOW_SERVO_2, 0)
    pi.set_servo_pulsewidth(DOOR_SERVO, 0)
    pi.set_servo_pulsewidth(FAN_SERVO, 0)
    pi.stop()