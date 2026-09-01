# routes/notifications.py
# The backend queues notification messages here.
# The Telegram bot polls /api/notifications/pop to pick them up and send them.
# The backend never touches Telegram directly.

from collections import deque
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(tags=["notifications"])

_queue: deque = deque()
MAX_QUEUE = 100


def push_notification(text: str, parse_mode: str = None) -> None:
    """
    Called by automation.py to enqueue a notification.
    Never raises — a failed enqueue must not crash automation.
    """
    try:
        if len(_queue) >= MAX_QUEUE:
            _queue.popleft()
        _queue.append({"text": text, "parse_mode": parse_mode})
    except Exception as e:
        print(f"[Notify Queue] Failed to enqueue: {e}")


@router.get("/api/notifications/pop")
def pop_notifications():
    """Bot calls this to drain all pending notifications."""
    items = list(_queue)
    _queue.clear()
    return JSONResponse({"notifications": items})


@router.get("/api/notifications/count")
def notification_count():
    return {"count": len(_queue)}