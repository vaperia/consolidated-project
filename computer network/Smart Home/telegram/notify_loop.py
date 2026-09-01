# notify_loop.py  (bot side — place alongside main.py)
# Polls the backend's notification queue every few seconds.
# When messages are waiting, sends them to all ALLOWED_USERS via the bot.
# The backend never touches Telegram — all sending happens here.

import asyncio
import logging

import requests
from telegram import Bot
from telegram.error import TelegramError

from config import BASE_API, ALLOWED_USERS

logger = logging.getLogger(__name__)

POLL_INTERVAL = 5  # seconds between polls


async def notify_loop(bot: Bot):
    logger.info("[NotifyLoop] Started.")

    while True:
        await asyncio.sleep(POLL_INTERVAL)

        try:
            r = await asyncio.to_thread(
                requests.get,
                f"{BASE_API}/api/notifications/pop",
                timeout=5,
            )
            r.raise_for_status()
            notifications = r.json().get("notifications", [])
        except Exception as e:
            logger.warning(f"[NotifyLoop] Could not poll backend: {e}")
            continue

        for notif in notifications:
            text = notif.get("text", "")
            parse_mode = notif.get("parse_mode") or None  # None = plain text, always safe

            if not text:
                continue

            for user_id in ALLOWED_USERS:
                try:
                    await bot.send_message(
                        chat_id=user_id,
                        text=text,
                        parse_mode=parse_mode,
                    )
                except TelegramError as e:
                    logger.warning(f"[NotifyLoop] Failed to send to {user_id}: {e}")