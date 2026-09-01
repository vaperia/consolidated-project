import time

from config import SEND_INTERVAL_SEC
from sensors import SensorController
from dashboard_client import send_to_dashboard


def main():
    controller = SensorController()

    print("Sensor controller started.")
    print("Sending sensor updates to dashboard...")

    last_sent_payload = None

    try:
        while True:
            try:
                payload = controller.read_all()

                if payload["temperature"] is None:
                    time.sleep(SEND_INTERVAL_SEC)
                    continue

                payload["temperature"] = float(payload["temperature"])
                payload["rain_raw"] = int(payload["rain_raw"])

                print(f"[SENSOR] {payload}")

                if payload != last_sent_payload:
                    success = send_to_dashboard(payload)
                    if success:
                        last_sent_payload = payload.copy()

                time.sleep(SEND_INTERVAL_SEC)

            except Exception as e:
                print(f"[ERROR] Unexpected sensor loop error: {e}")
                time.sleep(2)

    except KeyboardInterrupt:
        print("Stopping sensor controller.")

    finally:
        controller.cleanup()


if __name__ == "__main__":
    main()
