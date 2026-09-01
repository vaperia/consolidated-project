# routes/light.py
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime
import requests

from state import state_lock, system_state
from runtime_config import ACTUATOR_BASE_URL, REQUEST_TIMEOUT

router = APIRouter(prefix="/api/light", tags=["light"])


def send_light_command(action: str):
    r = requests.post(
        f"{ACTUATOR_BASE_URL}/light",
        json={"action": action},
        timeout=REQUEST_TIMEOUT,
    )
    r.raise_for_status()
    return r.json()


@router.post("/on")
def light_on():
    try:
        send_light_command("on")
        with state_lock:
            system_state["light"] = True
            system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
        return {"ok": True, "light": True}
    except Exception as e:
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)


@router.post("/off")
def light_off():
    try:
        send_light_command("off")
        with state_lock:
            system_state["light"] = False
            system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
        return {"ok": True, "light": False}
    except Exception as e:
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)