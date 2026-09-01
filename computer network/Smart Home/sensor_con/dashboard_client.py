import requests

from config import DASHBOARD_API_URL, REQUEST_TIMEOUT_SEC


def send_to_dashboard(payload: dict) -> bool:
    try:
        response = requests.post(
            DASHBOARD_API_URL,
            json=payload,
            timeout=REQUEST_TIMEOUT_SEC,
            proxies={"http": None, "https": None},
        )
        print(f"[INFO] Dashboard POST {response.status_code}: {response.text}")
        response.raise_for_status()
        return True
    except requests.RequestException as e:
        print(f"[ERROR] Failed to contact dashboard: {e}")
        return False
