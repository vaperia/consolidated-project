# events.py
import json
from pathlib import Path


def log_event(event_log_path: str, event: dict):
    p = Path(event_log_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")