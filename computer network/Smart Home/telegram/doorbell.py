# doorbell.py
# Drop this file into your Telegram bot folder (alongside main.py, commands.py, etc.)
# It polls the smart cam backend for new detection events and sends a 10-second
# video clip to every user in ALLOWED_USERS.

import asyncio
import io
import time
import logging
from datetime import datetime

import requests
from telegram import Bot
from telegram.error import TelegramError

from config import TOKEN, CAMERA_API, ALLOWED_USERS

logger = logging.getLogger(__name__)

# How often (seconds) we ask the backend "anything new?"
POLL_INTERVAL = 3

# Length of the video clip in seconds
CLIP_DURATION = 20

# Minimum seconds to wait before sending another alert (anti-spam cooldown)
ALERT_COOLDOWN_SEC = 60

# Event types that should trigger a clip notification
TRIGGER_EVENTS = {"unknown_face_detected", "face_detected"}

# We track the timestamp of the last event we already notified about
# so we don't double-send on the same event.
_last_seen_ts: str = ""
_last_alert_time: float = 0.0


def _fetch_latest_event() -> dict | None:
    """Returns the single most recent event from the backend, or None."""
    try:
        r = requests.get(f"{CAMERA_API}/api/camera/events", params={"limit": 1}, timeout=5)
        r.raise_for_status()
        events = r.json()
        return events[0] if events else None
    except Exception as e:
        logger.warning(f"[Doorbell] Could not fetch events: {e}")
        return None


def _fetch_clip() -> bytes | None:
    """
    Asks the backend to start a 20-second recording and waits for it.
    Returns raw mp4 bytes, or None on failure.
    """
    try:
        r = requests.post(
            f"{CAMERA_API}/api/camera/clip",
            params={"duration": CLIP_DURATION},
            timeout=CLIP_DURATION + 15
        )
        r.raise_for_status()
        return r.content
    except Exception as e:
        logger.warning(f"[Doorbell] Could not fetch clip: {e}")
        return None


def _fetch_snapshot() -> bytes | None:
    """Fallback: grab the latest JPEG frame if clip recording fails."""
    try:
        r = requests.get(f"{CAMERA_API}/api/camera/snapshot", timeout=5)
        r.raise_for_status()
        return r.content
    except Exception as e:
        logger.warning(f"[Doorbell] Could not fetch snapshot: {e}")
        return None


async def _notify_all(bot: Bot, event: dict, clip: bytes | None, snapshot: bytes | None):
    """Sends the clip (or snapshot fallback) to every allowed user."""
    ev_type = event.get("type", "detection")
    ts = event.get("ts", datetime.now().isoformat(timespec="seconds"))
    num_unknown = event.get("num_unknown", 0)
    num_faces = event.get("num_faces", 0)

    if ev_type == "unknown_face_detected":
        emoji = "🚨"
        who = f"{num_unknown} unknown person(s) detected"
    else:
        emoji = "👤"
        who = f"{num_faces} person(s) detected"

    live_url = f"{CAMERA_API}/view"
    caption = (
        f"{emoji} *Doorbell Alert*\n"
        f"──────────────────\n"
        f"📋 {who}\n"
        f"⏱ {ts}\n"
        f"📷 Front Door Camera\n"
        f"🔴 [Watch Live]({live_url})"
    )

    for user_id in ALLOWED_USERS:
        try:
            if clip:
                await bot.send_video(
                    chat_id=user_id,
                    video=io.BytesIO(clip),
                    filename="doorbell_clip.mp4",
                    caption=caption,
                    parse_mode="Markdown",
                    supports_streaming=True,
                )
            elif snapshot:
                await bot.send_photo(
                    chat_id=user_id,
                    photo=io.BytesIO(snapshot),
                    caption=caption + "\n\n_(Video unavailable — sending snapshot)_",
                    parse_mode="Markdown",
                )
            else:
                await bot.send_message(
                    chat_id=user_id,
                    text=caption + "\n\n_(No media available)_",
                    parse_mode="Markdown",
                )

            logger.info(f"[Doorbell] Notified user {user_id}")

        except TelegramError as e:
            logger.warning(f"[Doorbell] Failed to notify user {user_id}: {e}")


async def doorbell_loop(bot: Bot):
    """
    Main polling loop. Run this as a background asyncio task alongside your bot.
    It checks for new detection events every POLL_INTERVAL seconds. When a new
    event is found it fetches a 20-second clip and pushes it to all ALLOWED_USERS.
    Won't send another alert until ALERT_COOLDOWN_SEC has passed.
    """
    global _last_seen_ts, _last_alert_time
    logger.info("[Doorbell] Polling loop started.")

    while True:
        await asyncio.sleep(POLL_INTERVAL)

        event = await asyncio.to_thread(_fetch_latest_event)
        if not event:
            continue

        ev_type = event.get("type", "")
        ev_ts = event.get("ts", "")

        # Skip if it's not a face event or we've already handled this exact event
        if ev_type not in TRIGGER_EVENTS:
            continue
        if ev_ts == _last_seen_ts:
            continue

        # Skip if we're still in the cooldown window
        now = time.time()
        if now - _last_alert_time < ALERT_COOLDOWN_SEC:
            _last_seen_ts = ev_ts
            logger.info(
                f"[Doorbell] Skipping alert — cooldown active "
                f"({int(ALERT_COOLDOWN_SEC - (now - _last_alert_time))}s remaining)"
            )
            continue

        _last_seen_ts = ev_ts
        _last_alert_time = now
        logger.info(f"[Doorbell] New event: {ev_type} at {ev_ts} — fetching clip...")

        clip = await asyncio.to_thread(_fetch_clip)
        snapshot = None

        if not clip:
            logger.warning("[Doorbell] Clip failed, falling back to snapshot.")
            snapshot = await asyncio.to_thread(_fetch_snapshot)

        await _notify_all(bot, event, clip, snapshot)