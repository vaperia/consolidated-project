# weather.py
# Drop this into your Telegram bot folder alongside main.py
# - Sends a morning weather forecast at 8:00 AM daily
# - Checks every 15 minutes for sudden rain and alerts + closes windows

import asyncio
import logging
from datetime import datetime, time as dtime

import requests
from telegram import Bot
from telegram.error import TelegramError

from config import BASE_API, ALLOWED_USERS

logger = logging.getLogger(__name__)

MORNING_UPDATE_TIME = dtime(8, 0)   # 8:00 AM
RAIN_CHECK_INTERVAL = 15 * 60       # 15 minutes in seconds
WEATHER_API_URL = "https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast"
AREA = "Punggol"

# Track whether we already alerted for current rain event (avoid spam)
_rain_alerted = False
_morning_sent_date = None


def get_forecast() -> str:
    """Fetch the current 2-hour forecast for the area."""
    try:
        r = requests.get(WEATHER_API_URL, timeout=5)
        r.raise_for_status()
        data = r.json()
        items = data.get("data", {}).get("items", [])
        if not items:
            return "DATA_UNAVAILABLE"
        for area_data in items[0].get("forecasts", []):
            if area_data.get("area") == AREA:
                return area_data.get("forecast", "UNKNOWN")
        return "AREA_NOT_FOUND"
    except requests.exceptions.Timeout:
        return "API_TIMEOUT"
    except requests.exceptions.RequestException:
        return "API_ERROR"


def is_rain_forecast(forecast: str) -> bool:
    """Returns True if the forecast indicates rain."""
    rain_keywords = ["rain", "shower", "thundery", "thunder"]
    return any(kw in forecast.lower() for kw in rain_keywords)


def close_windows():
    """Tell the backend to close both windows."""
    try:
        requests.post(f"{BASE_API}/api/window/1/close", timeout=10)
        logger.info("[Weather] Windows closed due to rain forecast.")
    except Exception as e:
        logger.warning(f"[Weather] Failed to close windows: {e}")


def get_weather_emoji(forecast: str) -> str:
    """Pick an emoji based on forecast text."""
    f = forecast.lower()
    if "thunder" in f:
        return "⛈"
    if "rain" in f or "shower" in f:
        return "🌧"
    if "cloud" in f:
        return "☁️"
    if "fair" in f or "sunny" in f or "clear" in f:
        return "☀️"
    if "wind" in f:
        return "💨"
    return "🌤"


async def notify_all(bot: Bot, message: str):
    """Send a message to all allowed users."""
    for user_id in ALLOWED_USERS:
        try:
            await bot.send_message(
                chat_id=user_id,
                text=message,
                parse_mode="Markdown",
            )
        except TelegramError as e:
            logger.warning(f"[Weather] Failed to notify {user_id}: {e}")


async def weather_loop(bot: Bot):
    """
    Main weather loop:
    - Sends morning forecast at 8:00 AM
    - Checks every 15 minutes for rain and alerts + closes windows
    """
    global _rain_alerted, _morning_sent_date
    logger.info("[Weather] Loop started.")

    while True:
        now = datetime.now()

        # ── Morning update at 8:00 AM ──────────────────────────────
        if (now.time() >= MORNING_UPDATE_TIME and
                _morning_sent_date != now.date()):

            _morning_sent_date = now.date()
            forecast = get_forecast()
            emoji = get_weather_emoji(forecast)

            await notify_all(
                bot,
                f"🌅 *Good Morning! Daily Weather Update*\n"
                f"───────────────────\n"
                f"{emoji} *{AREA} Forecast:* {forecast}\n"
                f"⏱ {now.strftime('%d %b %Y, %I:%M %p')}"
            )
            logger.info(f"[Weather] Morning update sent: {forecast}")

        # ── Rain check every 15 minutes ────────────────────────────
        forecast = get_forecast()

        if is_rain_forecast(forecast) and not _rain_alerted:
            _rain_alerted = True
            close_windows()
            await notify_all(
                bot,
                f"🌧 *Rain Alert!*\n"
                f"───────────────────\n"
                f"⚠️ *{AREA} Forecast:* {forecast}\n"
                f"🪟 Windows have been automatically closed.\n"
                f"⏱ {now.strftime('%I:%M %p')}"
            )
            logger.info(f"[Weather] Rain alert sent and windows closed: {forecast}")

        elif not is_rain_forecast(forecast) and _rain_alerted:
            # Rain has cleared — reset alert so next rain triggers again
            _rain_alerted = False
            logger.info("[Weather] Rain cleared, alert reset.")

        await asyncio.sleep(RAIN_CHECK_INTERVAL)