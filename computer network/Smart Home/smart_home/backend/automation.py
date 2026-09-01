import threading
import time
from datetime import datetime

import requests

from state import state_lock, system_state
from routes.door import send_door_command
from routes.light import send_light_command
import runtime_config as cfg
from routes.notifications import push_notification

_last_seen_name = None
_last_seen_since = 0.0
_last_open_ts = 0.0
_auto_close_thread_running = False
_last_motion_ts = 0.0
_last_window_action = None

# Tracks the last state values that automation itself wrote.
# If the current state differs from these, a manual override happened.
# None means "not yet set by automation" — don't trigger on first loop.
_auto_last_known = {
    "fan":     None,   # "on" / "off"
    "light":   None,   # True / False
    "window1": None,   # "open" / "closed"
    "window2": None,   # "open" / "closed"
    "door":    None,   # "open" / "closed"
}


def _cfg(name, default):
    return getattr(cfg, name, default)


CAMERA_API = _cfg("CAMERA_API", "http://127.0.0.1:5001")
FACE_STABLE_SEC = _cfg("FACE_STABLE_SEC", 3.0)
DOOR_OPEN_COOLDOWN_SEC = _cfg("DOOR_OPEN_COOLDOWN_SEC", 15.0)
AUTO_CLOSE_DELAY_SEC = _cfg("AUTO_CLOSE_DELAY_SEC", 10.0)
AUTOMATION_POLL_SEC = _cfg("AUTOMATION_POLL_SEC", 1.0)
REQUEST_TIMEOUT = _cfg("REQUEST_TIMEOUT", 2.0)

# Temperature automation
FAN_AUTO_ON_TEMP_C = _cfg("FAN_AUTO_ON_TEMP_C", 27.0)          # fan turns ON at this temp, never auto-off
WINDOW_VENTILATION_TEMP_C = _cfg("WINDOW_VENTILATION_TEMP_C", 28.0)  # windows open at this temp (no rain)

# Motion light
MOTION_LIGHT_HOLD_SEC = _cfg("MOTION_LIGHT_HOLD_SEC", 10.0)

# Rain logic
WINDOW_RAIN_OPEN_THRESHOLD = _cfg("WINDOW_RAIN_OPEN_THRESHOLD", 680)


# ---------------------------------------------------------------------------
# Manual override detection — runs at the top of every automation loop tick
# ---------------------------------------------------------------------------

def check_manual_overrides():
    """
    Compares the current system_state against what automation last wrote.
    If anything differs, it means a dashboard route changed the device manually,
    so we disable the relevant automation flag and notify the user.
    No changes to route files required.
    """
    with state_lock:
        current = {
            "fan":     system_state.get("fan"),
            "light":   system_state.get("light"),
            "window1": system_state.get("window1"),
            "window2": system_state.get("window2"),
            "door":    system_state.get("door"),
        }

    device_labels = {
        "fan":     "🌀 Fan",
        "light":   "💡 Light",
        "window1": "🪟 Window 1",
        "window2": "🪟 Window 2",
        "door":    "🚪 Door",
    }

    for key, current_val in current.items():
        last_val = _auto_last_known[key]

        # Skip if automation has never written this device yet
        if last_val is None:
            continue

        if current_val != last_val:
            print(f"[MANUAL OVERRIDE] {key} changed {last_val!r} -> {current_val!r} externally")

            # Update our snapshot so we don't keep re-triggering
            _auto_last_known[key] = current_val

            with state_lock:
                if key == "fan":
                    if system_state.get("fan_auto_enabled", True):
                        system_state["fan_auto_enabled"] = False
                        push_notification("🔧 Manual override detected\n🌀 Fan was changed manually — Fan Auto turned off")
                elif key == "light":
                    if system_state.get("light_auto_enabled", True):
                        system_state["light_auto_enabled"] = False
                        push_notification("🔧 Manual override detected\n💡 Light was changed manually — Light Auto turned off")
                elif key in ("window1", "window2"):
                    if system_state.get("window_auto_enabled", True):
                        system_state["window_auto_enabled"] = False
                        push_notification("🔧 Manual override detected\n🪟 Window was changed manually — Window Auto turned off")


# ---------------------------------------------------------------------------
# Debug / state helpers
# ---------------------------------------------------------------------------

def set_debug(step=None, status=None, error=None, camera_online=None, camera_payload=None):
    with state_lock:
        if step is not None:
            system_state["automation_last_step"] = step
        if status is not None:
            system_state["automation_status"] = status
        if error is not None:
            system_state["automation_last_error"] = error
        if camera_online is not None:
            system_state["camera_online"] = camera_online
        if camera_payload is not None:
            system_state["camera_last_payload"] = camera_payload


def is_master_automation_enabled():
    with state_lock:
        return bool(system_state.get("automation_enabled", True))


def is_fan_auto_enabled():
    with state_lock:
        return bool(system_state.get("fan_auto_enabled", True))


def is_light_auto_enabled():
    with state_lock:
        return bool(system_state.get("light_auto_enabled", True))


def is_window_auto_enabled():
    with state_lock:
        return bool(system_state.get("window_auto_enabled", True))


def is_door_auto_enabled():
    with state_lock:
        return bool(system_state.get("door_auto_enabled", True))


# ---------------------------------------------------------------------------
# Camera
# ---------------------------------------------------------------------------

def fetch_camera_status():
    r = requests.get(f"{CAMERA_API}/api/camera/status", timeout=REQUEST_TIMEOUT)
    r.raise_for_status()
    return r.json()


# ---------------------------------------------------------------------------
# Window actuator
# ---------------------------------------------------------------------------

def send_window_command(action: str):
    r = requests.post(
        f"{cfg.ACTUATOR_BASE_URL}/window",
        json={"action": action},
        timeout=REQUEST_TIMEOUT,
    )
    r.raise_for_status()
    try:
        return r.json()
    except Exception:
        return {"raw_text": r.text}


# ---------------------------------------------------------------------------
# Auto-close door
# ---------------------------------------------------------------------------

def auto_close_door_later():
    global _auto_close_thread_running

    try:
        print(f"[AUTO CLOSE] waiting {AUTO_CLOSE_DELAY_SEC}s before closing")
        time.sleep(AUTO_CLOSE_DELAY_SEC)

        if not is_door_auto_enabled():
            print("[AUTO CLOSE] skipped because door auto is off")
            set_debug(step="auto_close_skipped_door_auto_off", status="running", error=None)
            return

        set_debug(step="auto_close_sending_close", status="running", error=None)
        send_door_command("close")

        with state_lock:
            system_state["door"] = "closed"
            system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")

        _auto_last_known["door"] = "closed"
        print("[AUTO CLOSE] door closed")
        set_debug(step="auto_close_done", status="running", error=None)
        push_notification("🚪 Door closed automatically\n⏱️ Auto-close timer expired")

    except Exception as e:
        print(f"[AUTO CLOSE ERROR] {e}")
        set_debug(step="auto_close_error", status="error", error=str(e))

    finally:
        _auto_close_thread_running = False


# ---------------------------------------------------------------------------
# Fan temperature automation
# ---------------------------------------------------------------------------
# Rules:
#   >= 25°C  → turn fan ON  (if not already on)
#   <  25°C  → do nothing   (fan never auto-off; user controls that)
# ---------------------------------------------------------------------------

def check_fan_temp_auto():
    try:
        with state_lock:
            temp = system_state.get("temperature_c")
            fan_state = system_state.get("fan", "off")

        if temp is None:
            return

        if temp >= FAN_AUTO_ON_TEMP_C and fan_state != "on":
            print(f"[FAN TEMP AUTO] temp={temp}°C >= {FAN_AUTO_ON_TEMP_C}°C -> FAN ON")

            r = requests.post(
                f"{cfg.ACTUATOR_BASE_URL}/fan",
                json={"action": "on"},
                timeout=REQUEST_TIMEOUT,
            )
            r.raise_for_status()

            with state_lock:
                system_state["fan"] = "on"
                system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")

            _auto_last_known["fan"] = "on"
            set_debug(step=f"fan_temp_on:{temp}", status="running", error=None)
            push_notification(
                f"🌀 Fan turned ON automatically\n🌡️ Temperature reached {temp}°C (threshold {FAN_AUTO_ON_TEMP_C}°C)"
            )
        else:
            # Below threshold — automation does nothing, fan stays as user left it
            set_debug(step=f"fan_temp_below_threshold:{temp}", status="running", error=None)

    except Exception as e:
        print(f"[FAN TEMP AUTO ERROR] {e}")
        set_debug(step="fan_temp_auto_error", status="error", error=str(e))


# ---------------------------------------------------------------------------
# Motion light
# ---------------------------------------------------------------------------

def check_motion_light():
    global _last_motion_ts

    try:
        now_ts = time.time()

        with state_lock:
            motion = bool(system_state.get("motion", False))
            light_on = bool(system_state.get("light", False))

        if motion:
            _last_motion_ts = now_ts

            if not light_on:
                print("[MOTION LIGHT] motion detected -> turning light on")
                send_light_command("on")

                with state_lock:
                    system_state["light"] = True
                    system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")

                _auto_last_known["light"] = True
                set_debug(step="motion_light_on", status="running", error=None)
                push_notification("💡 Light turned ON automatically\n🚶 Motion detected")

        else:
            if light_on and _last_motion_ts > 0:
                idle_sec = now_ts - _last_motion_ts
                print(f"[MOTION LIGHT] no motion, idle_sec={idle_sec:.2f}")

                if idle_sec >= MOTION_LIGHT_HOLD_SEC:
                    print("[MOTION LIGHT] hold expired -> turning light off")
                    send_light_command("off")

                    with state_lock:
                        system_state["light"] = False
                        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")

                    _auto_last_known["light"] = False
                    set_debug(step="motion_light_off", status="running", error=None)
                    push_notification("💡 Light turned OFF automatically\n😴 No motion for a while")
                    _last_motion_ts = 0.0

    except Exception as e:
        print(f"[MOTION LIGHT ERROR] {e}")
        set_debug(step="motion_light_error", status="error", error=str(e))


# ---------------------------------------------------------------------------
# Window automation
# ---------------------------------------------------------------------------
# Rules (priority order):
#   1. Rain detected  → close windows always (overrides temp logic)
#   2. >= 26°C        → open windows if closed (ventilation)
#   3. < 26°C, no rain → do nothing (user controls)
# ---------------------------------------------------------------------------

def check_window_auto():
    global _last_window_action

    try:
        with state_lock:
            rain_raw = system_state.get("rain_raw")
            temp = system_state.get("temperature_c")
            window1 = system_state.get("window1", "closed")
            window2 = system_state.get("window2", "closed")

        is_raining = rain_raw is not None and rain_raw <= WINDOW_RAIN_OPEN_THRESHOLD
        windows_open = window1 == "open" or window2 == "open"
        windows_closed = window1 == "closed" and window2 == "closed"

        desired_action = None
        reason = None

        # Rule 1: Rain always closes windows
        if is_raining and not windows_closed:
            desired_action = "close"
            reason = f"rain:{rain_raw}"

        # Rule 2: >= 26°C and no rain → open for ventilation
        elif not is_raining and temp is not None and temp >= WINDOW_VENTILATION_TEMP_C and not windows_open:
            desired_action = "open"
            reason = f"temp:{temp}°C"

        # Rule 3: Below 26°C and no rain → do nothing
        else:
            set_debug(step=f"window_auto_idle:rain={is_raining},temp={temp}", status="running", error=None)
            return

        # Skip if already in the desired state
        already_done = (
            desired_action == _last_window_action and
            (
                (desired_action == "open"  and windows_open) or
                (desired_action == "close" and windows_closed)
            )
        )
        if already_done:
            return

        print(f"[WINDOW AUTO] reason={reason} -> {desired_action.upper()}")
        resp = send_window_command(desired_action)
        print("[WINDOW AUTO] actuator response:", resp)

        with state_lock:
            system_state["window1"] = "open" if desired_action == "open" else "closed"
            system_state["window2"] = "open" if desired_action == "open" else "closed"
            system_state["window_last_auto_action"] = desired_action
            system_state["window_last_auto_reason"] = reason
            system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")

        _auto_last_known["window1"] = "open" if desired_action == "open" else "closed"
        _auto_last_known["window2"] = "open" if desired_action == "open" else "closed"
        _last_window_action = desired_action

        action_label = "opened" if desired_action == "open" else "closed"
        reason_emoji = "🌧️" if desired_action == "close" else "🌡️"
        set_debug(step=f"window_auto_{desired_action}:{reason}", status="running", error=None)
        push_notification(f"🪟 Windows {action_label} automatically\n{reason_emoji} Reason: {reason}")

    except Exception as e:
        print(f"[WINDOW AUTO ERROR] {e}")
        set_debug(step="window_auto_error", status="error", error=str(e))


# ---------------------------------------------------------------------------
# Camera / face recognition logic
# ---------------------------------------------------------------------------

def handle_camera_logic():
    global _last_seen_name, _last_seen_since, _last_open_ts, _auto_close_thread_running

    try:
        set_debug(step="poll_camera", status="running", error=None)

        cam = fetch_camera_status()
        now_ts = time.time()

        recognized_name = cam.get("recognized_name")
        if recognized_name is not None:
            recognized_name = str(recognized_name).strip()

        if recognized_name in ("", "UNKNOWN", "NO_FACE", "None"):
            recognized_name = None

        print(f"[AUTOMATION] camera payload = {cam}")
        print(f"[AUTOMATION] recognized_name = {recognized_name}")

        set_debug(
            step="camera_polled",
            status="running",
            error=None,
            camera_online=True,
            camera_payload=cam,
        )

        with state_lock:
            system_state["recognized_name"] = recognized_name
            system_state["last_recognized_ts"] = (
                datetime.now().isoformat(timespec="seconds") if recognized_name else None
            )

        if recognized_name:
            if recognized_name != _last_seen_name:
                _last_seen_name = recognized_name
                _last_seen_since = now_ts

                print(f"[AUTOMATION] new recognized face seen: {recognized_name}")
                set_debug(step=f"new_face_seen:{recognized_name}", status="running", error=None)

                with state_lock:
                    system_state["recognized_stable"] = False

            else:
                stable_time = now_ts - _last_seen_since
                cooldown_ok = (now_ts - _last_open_ts) >= DOOR_OPEN_COOLDOWN_SEC

                print(
                    f"[AUTOMATION] face={recognized_name} stable_time={stable_time:.2f}s "
                    f"cooldown_ok={cooldown_ok} door_auto={is_door_auto_enabled()}"
                )

                with state_lock:
                    system_state["recognized_stable"] = stable_time >= FACE_STABLE_SEC

                if stable_time >= FACE_STABLE_SEC and cooldown_ok and is_door_auto_enabled():
                    print(f"[AUTO OPEN] recognized stable face: {recognized_name}")
                    set_debug(step=f"opening_door_for:{recognized_name}", status="running", error=None)

                    send_door_command("open")
                    _last_open_ts = now_ts

                    with state_lock:
                        system_state["door"] = "open"
                        system_state["door_last_open_reason"] = f"face:{recognized_name}"
                        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")

                    _auto_last_known["door"] = "open"
                    print("[AUTO OPEN] door open command sent successfully")
                    set_debug(step="door_open_sent", status="running", error=None)
                    push_notification(f"🚪 Door opened automatically\n👤 Recognized: {recognized_name}\n⏱️ Will auto-close in {int(AUTO_CLOSE_DELAY_SEC)}s")

                    if not _auto_close_thread_running:
                        _auto_close_thread_running = True
                        threading.Thread(target=auto_close_door_later, daemon=True).start()

                elif stable_time >= FACE_STABLE_SEC and cooldown_ok and not is_door_auto_enabled():
                    set_debug(
                        step=f"door_auto_disabled_for:{recognized_name}",
                        status="running",
                        error=None,
                    )
                elif stable_time < FACE_STABLE_SEC:
                    set_debug(
                        step=f"waiting_stable:{recognized_name}:{stable_time:.2f}s",
                        status="running",
                        error=None,
                    )
                elif not cooldown_ok:
                    set_debug(
                        step=f"cooldown_active:{recognized_name}",
                        status="running",
                        error=None,
                    )
        else:
            if _last_seen_name is not None:
                print("[AUTOMATION] face lost, resetting stable timer")

            _last_seen_name = None
            _last_seen_since = 0.0

            with state_lock:
                system_state["recognized_stable"] = False
                system_state["recognized_name"] = None
                system_state["last_recognized_ts"] = None

            set_debug(step="no_known_face", status="running", error=None)

    except Exception as e:
        print(f"[CAMERA POLL ERROR] {e}")
        _last_seen_name = None
        _last_seen_since = 0.0

        with state_lock:
            system_state["recognized_stable"] = False
            system_state["recognized_name"] = None
            system_state["last_recognized_ts"] = None

        set_debug(step="camera_offline", status="running", error=str(e), camera_online=False)


# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------

def automation_loop():
    set_debug(step="automation_started", status="running", error=None)

    while True:
        try:
            check_manual_overrides()

            master = is_master_automation_enabled()

            if is_fan_auto_enabled():
                check_fan_temp_auto()
            else:
                set_debug(step="fan_auto_paused", status="running", error=None)

            if is_light_auto_enabled():
                check_motion_light()
            else:
                set_debug(step="light_auto_paused", status="running", error=None)

            if is_window_auto_enabled():
                check_window_auto()
            else:
                set_debug(step="window_auto_paused", status="running", error=None)

            handle_camera_logic()

        except Exception as e:
            print(f"[AUTOMATION LOOP ERROR] {e}")
            set_debug(step="automation_exception", status="error", error=str(e), camera_online=False)

        time.sleep(AUTOMATION_POLL_SEC)


def start_automation_thread():
    t = threading.Thread(target=automation_loop, daemon=True)
    t.start()