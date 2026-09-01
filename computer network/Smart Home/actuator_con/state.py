import threading

state_lock = threading.Lock()

system_state = {
    "window": "closed",
    "door": "closed",
    "light": "off",
    "fan": "off",
}
