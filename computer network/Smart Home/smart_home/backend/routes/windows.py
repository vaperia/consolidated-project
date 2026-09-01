# routes/windows.py
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from datetime import datetime
import requests

from state import state_lock, system_state
from runtime_config import ACTUATOR_BASE_URL, REQUEST_TIMEOUT

router = APIRouter(prefix="/api/window", tags=["windows"])


def send_window_command(action: str):
    r = requests.post(
        f"{ACTUATOR_BASE_URL}/window",
        json={"action": action},
        timeout=REQUEST_TIMEOUT,
    )
    r.raise_for_status()
    return r.json()


@router.post("/1/open")
def open_window_1():
    try:
        send_window_command("open")
        with state_lock:
            system_state["window1"] = "open"
            system_state["window2"] = "open"
            system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
        return {"ok": True, "window1": "open", "window2": "open"}
    except Exception as e:
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)


@router.post("/1/close")
def close_window_1():
    try:
        send_window_command("close")
        with state_lock:
            system_state["window1"] = "closed"
            system_state["window2"] = "closed"
            system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
        return {"ok": True, "window1": "closed", "window2": "closed"}
    except Exception as e:
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)


@router.post("/2/open")
def open_window_2():
    try:
        send_window_command("open")
        with state_lock:
            system_state["window1"] = "open"
            system_state["window2"] = "open"
            system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
        return {"ok": True, "window1": "open", "window2": "open"}
    except Exception as e:
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)


@router.post("/2/close")
def close_window_2():
    try:
        send_window_command("close")
        with state_lock:
            system_state["window1"] = "closed"
            system_state["window2"] = "closed"
            system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")
        return {"ok": True, "window1": "closed", "window2": "closed"}
    except Exception as e:
        return JSONResponse({"ok": False, "error": str(e)}, status_code=500)