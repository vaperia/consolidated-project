# routes/door.py
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime
import requests

from state import state_lock, system_state
from runtime_config import ACTUATOR_BASE_URL, REQUEST_TIMEOUT

router = APIRouter(prefix="/api/door", tags=["door"])


def send_door_command(action: str):
    ts = datetime.now().isoformat(timespec="seconds")
    url = f"{ACTUATOR_BASE_URL}/door"

    print(f"[DOOR CMD] action={action} url={url}")

    with state_lock:
        system_state["door_command_last_action"] = action
        system_state["door_command_last_result"] = "sending"
        system_state["door_command_last_error"] = None
        system_state["door_command_last_ts"] = ts

    try:
        r = requests.post(
            url,
            json={"action": action},
            timeout=REQUEST_TIMEOUT,
        )
        r.raise_for_status()

        try:
            payload = r.json()
        except Exception:
            payload = {"raw_text": r.text}

        print(f"[DOOR CMD OK] action={action} response={payload}")

        with state_lock:
            system_state["door_command_last_result"] = "ok"
            system_state["door_command_last_error"] = None
            system_state["door_command_last_ts"] = datetime.now().isoformat(timespec="seconds")

        return payload

    except Exception as e:
        print(f"[DOOR CMD ERROR] action={action} error={e}")

        with state_lock:
            system_state["door_command_last_result"] = "error"
            system_state["door_command_last_error"] = str(e)
            system_state["door_command_last_ts"] = datetime.now().isoformat(timespec="seconds")

        raise


@router.post("/open")
def door_open():
    try:
        send_door_command("open")
        with state_lock:
            system_state["door"] = "open"
            system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
            system_state["door_last_open_reason"] = "manual"
        return {"ok": True, "door": "open"}
    except Exception as e:
        print("[DOOR OPEN ERROR]", e)
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)


@router.post("/close")
def door_close():
    try:
        send_door_command("close")
        with state_lock:
            system_state["door"] = "closed"
            system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
        return {"ok": True, "door": "closed"}
    except Exception as e:
        print("[DOOR CLOSE ERROR]", e)
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)