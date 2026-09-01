# routes/fan.py
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime
import requests

from state import state_lock, system_state
from runtime_config import ACTUATOR_BASE_URL, REQUEST_TIMEOUT

router = APIRouter(prefix="/api/fan", tags=["fan"])

def send_fan_command(action: str):
    r = requests.post(
        f"{ACTUATOR_BASE_URL}/fan",
        json={"action": action},
        timeout=REQUEST_TIMEOUT,
    )
    r.raise_for_status()
    return r.json()


@router.post("/on")
def fan_on():
    try:
        send_fan_command("on")

        with state_lock:
            system_state["fan"] = "on"
            system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")

        return {"ok": True, "fan": "on"}

    except Exception as e:
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)


@router.post("/off")
def fan_off():
    try:
        send_fan_command("off")

        with state_lock:
            system_state["fan"] = "off"
            system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")

        return {"ok": True, "fan": "off"}

    except Exception as e:
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)