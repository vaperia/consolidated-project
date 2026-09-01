from fastapi import APIRouter
from datetime import datetime

from state import state_lock, system_state

router = APIRouter(tags=["sensors"])


@router.post("/api/sensor/update")
@router.post("/api/sensor-update")
def sensor_update(payload: dict):
    print("[SENSOR ROUTE] raw payload =", payload)

    rain_raw = payload.get("rain_raw")
    motion = payload.get("motion")
    temperature_c = payload.get("temperature_c")
    temperature = payload.get("temperature")
    humidity = payload.get("humidity")

    with state_lock:
        if motion is not None:
            system_state["motion"] = motion

        if temperature_c is not None:
            system_state["temperature_c"] = temperature_c
        elif temperature is not None:
            system_state["temperature_c"] = temperature

        if humidity is not None:
            system_state["humidity"] = humidity

        if rain_raw is not None:
            system_state["rain_raw"] = rain_raw

            if rain_raw >= 660:
                system_state["rain_status"] = "no rain"
            elif 590 < rain_raw < 660:
                system_state["rain_status"] = "light rain"
            elif rain_raw <= 590:
                system_state["rain_status"] = "heavy rain"

        system_state["sensor_status"] = "online"
        system_state["last_updated"] = datetime.now().isoformat(timespec="seconds")

    return {
        "ok": True,
        "message": "Sensor data updated",
        "state": system_state,
    }