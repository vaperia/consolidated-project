from datetime import datetime

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from state import state_lock, system_state

router = APIRouter()


@router.get("/health")
def health():
    return {"ok": True, "service": "dashboard-backend"}


@router.get("/api/state")
def get_state():
    with state_lock:
        return JSONResponse({
            "automation_enabled": system_state.get("automation_enabled", True),
            "fan_auto_enabled": system_state.get("fan_auto_enabled", True),
            "light_auto_enabled": system_state.get("light_auto_enabled", True),
            "window_auto_enabled": system_state.get("window_auto_enabled", True),
            "door_auto_enabled": system_state.get("door_auto_enabled", True),

            "window1": system_state.get("window1", "closed"),
            "window2": system_state.get("window2", "closed"),
            "light": system_state.get("light", False),
            "fan": system_state.get("fan", "off"),
            "door": system_state.get("door", "closed"),

            "recognized_name": system_state.get("recognized_name"),
            "recognized_stable": system_state.get("recognized_stable", False),
            "door_last_open_reason": system_state.get("door_last_open_reason"),

            "rain_raw": system_state.get("rain_raw"),
            "rain_status": system_state.get("rain_status", "unknown"),

            "temperature_c": system_state.get("temperature_c"),
            "humidity": system_state.get("humidity"),
            "motion": system_state.get("motion"),
            "sensor_status": system_state.get("sensor_status"),
            "last_updated": system_state.get("last_updated"),

            "window_last_auto_action": system_state.get("window_last_auto_action"),
            "window_last_auto_reason": system_state.get("window_last_auto_reason"),

            "automation_status": system_state.get("automation_status"),
            "automation_last_step": system_state.get("automation_last_step"),
            "automation_last_error": system_state.get("automation_last_error"),
            "camera_online": system_state.get("camera_online"),
            "camera_last_payload": system_state.get("camera_last_payload"),
        })


@router.get("/api/temperature")
def get_temperature():
    with state_lock:
        data = {
            "temperature_c": system_state.get("temperature_c"),
            "humidity": system_state.get("humidity"),
            "motion": system_state.get("motion"),
            "rain_raw": system_state.get("rain_raw"),
            "rain_status": system_state.get("rain_status"),
            "sensor_status": system_state.get("sensor_status"),
            "last_updated": system_state.get("last_updated"),
        }
        print("[GET /api/temperature]", data)
        return data


@router.get("/api/full-state")
def full_state():
    with state_lock:
        data = dict(system_state)
    return JSONResponse(data)


@router.post("/api/automation/enable")
def enable_automation():
    with state_lock:
        system_state["automation_enabled"] = True
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
    return {"ok": True, "automation_enabled": True}


@router.post("/api/automation/disable")
def disable_automation():
    with state_lock:
        system_state["automation_enabled"] = False
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
    return {"ok": True, "automation_enabled": False}


@router.post("/api/automation/toggle")
def toggle_automation():
    with state_lock:
        system_state["automation_enabled"] = not bool(system_state.get("automation_enabled", True))
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
        val = system_state["automation_enabled"]
    return {"ok": True, "automation_enabled": val}


@router.post("/api/automation/fan/enable")
def enable_fan_auto():
    with state_lock:
        system_state["fan_auto_enabled"] = True
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
    return {"ok": True, "fan_auto_enabled": True}


@router.post("/api/automation/fan/disable")
def disable_fan_auto():
    with state_lock:
        system_state["fan_auto_enabled"] = False
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
    return {"ok": True, "fan_auto_enabled": False}


@router.post("/api/automation/light/enable")
def enable_light_auto():
    with state_lock:
        system_state["light_auto_enabled"] = True
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
    return {"ok": True, "light_auto_enabled": True}


@router.post("/api/automation/light/disable")
def disable_light_auto():
    with state_lock:
        system_state["light_auto_enabled"] = False
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
    return {"ok": True, "light_auto_enabled": False}


@router.post("/api/automation/window/enable")
def enable_window_auto():
    with state_lock:
        system_state["window_auto_enabled"] = True
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
    return {"ok": True, "window_auto_enabled": True}


@router.post("/api/automation/window/disable")
def disable_window_auto():
    with state_lock:
        system_state["window_auto_enabled"] = False
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
    return {"ok": True, "window_auto_enabled": False}


@router.post("/api/door-auto/enable")
def enable_door_auto():
    with state_lock:
        system_state["door_auto_enabled"] = True
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
    return {"ok": True, "door_auto_enabled": True}


@router.post("/api/door-auto/disable")
def disable_door_auto():
    with state_lock:
        system_state["door_auto_enabled"] = False
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
    return {"ok": True, "door_auto_enabled": False}


@router.post("/api/door-auto/toggle")
def toggle_door_auto():
    with state_lock:
        system_state["door_auto_enabled"] = not bool(system_state.get("door_auto_enabled", True))
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
        val = system_state["door_auto_enabled"]
    return {"ok": True, "door_auto_enabled": val}