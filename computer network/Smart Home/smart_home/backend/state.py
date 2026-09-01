import threading

state_lock = threading.Lock()

system_state = {
    # Toggles
    "automation_enabled": True,    # master — gates all 3 below
    "fan_auto_enabled": True,      # fan temperature automation
    "light_auto_enabled": True,    # motion light automation
    "window_auto_enabled": True,   # rain window automation
    "door_auto_enabled": True,     # face-recognition auto door

    # Actuators
    "window1": "closed",
    "window2": "closed",
    "door": "closed",
    "light": False,
    "fan": "off",

    # Sensor readings
    "temperature_c": None,
    "humidity": None,
    "motion": False,
    "rain_raw": None,
    "rain_status": "unknown",

    # Sensor health/status
    "sensor_status": "starting",
    "last_updated": None,

    # Camera / recognition
    "recognized_name": None,
    "recognized_stable": False,
    "last_recognized_ts": None,
    "door_last_open_reason": None,

    # Window automation debug
    "window_last_auto_action": None,
    "window_last_auto_reason": None,

    # Debug
    "automation_status": "starting",
    "automation_last_step": None,
    "automation_last_error": None,
    "camera_online": False,
    "camera_last_payload": None,
    "door_command_last_action": None,
    "door_command_last_result": None,
    "door_command_last_error": None,
    "door_command_last_ts": None,
}