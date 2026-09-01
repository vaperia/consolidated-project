# overlay.py
import cv2
from datetime import datetime


def draw_ring_header(frame, camera_name="Front Door", live_dot=True):
    h, w = frame.shape[:2]
    cv2.rectangle(frame, (0, 0), (w, 44), (0, 0, 0), -1)

    # Left: camera name
    cv2.putText(frame, camera_name, (12, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.85, (255, 255, 255), 2)

    # Right: LIVE + time
    ts = datetime.now().strftime("%H:%M:%S")
    text = f"LIVE {ts}"
    tw = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.65, 2)[0][0]
    x = w - tw - 16
    cv2.putText(frame, text, (x, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)

    if live_dot:
        cv2.circle(frame, (x - 14, 22), 6, (0, 0, 255), -1)


def draw_ring_footer(frame, fps: float, faces: int):
    h, w = frame.shape[:2]
    cv2.rectangle(frame, (0, h - 40), (w, h), (0, 0, 0), -1)
    s = f"FPS {fps:.1f}   Faces {faces}"
    cv2.putText(frame, s, (12, h - 14),
                cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)


def draw_banner(frame, text: str, kind: str = "info"):
    """
    kind: "info" | "warn" | "alert"
    """
    h, w = frame.shape[:2]
    y1, y2 = 48, 86

    if kind == "alert":
        bg = (0, 0, 120)
    elif kind == "warn":
        bg = (0, 80, 120)
    else:
        bg = (40, 40, 40)

    cv2.rectangle(frame, (0, y1), (w, y2), bg, -1)
    cv2.putText(frame, text, (12, 78),
                cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)


def draw_focus_zones(frame, inner_size=280, outer_size=560):
    # subtle guide box in center
    h, w = frame.shape[:2]
    cx, cy = w // 2, h // 2
    hi = inner_size // 2
    ho = outer_size // 2
    cv2.rectangle(frame, (cx - ho, cy - ho), (cx + ho, cy + ho), (60, 60, 60), 1)
    cv2.rectangle(frame, (cx - hi, cy - hi), (cx + hi, cy + hi), (110, 110, 110), 1)


def pick_focus_target(items, sx, sy, frame_w, frame_h):
    if not items:
        return None
    cx, cy = frame_w / 2.0, frame_h / 2.0
    best_i, best_d = None, 1e18
    for i, d in enumerate(items):
        x = (d["x"] + d["w"] / 2.0) * sx
        y = (d["y"] + d["h"] / 2.0) * sy
        dist = (x - cx) ** 2 + (y - cy) ** 2
        if dist < best_d:
            best_d = dist
            best_i = i
    return best_i


def draw_faces(frame, items, sx, sy, focus_i=None):
    for i, d in enumerate(items):
        x = int(d["x"] * sx)
        y = int(d["y"] * sy)
        w = int(d["w"] * sx)
        h = int(d["h"] * sy)

        label = d["label"]
        dist = d["dist"]
        tid = d.get("track_id", None)
        prefix = f"#{tid} " if tid is not None else ""

        unknown = (label == "UNKNOWN")
        color = (0, 0, 255) if unknown else (0, 200, 0)
        thickness = 4 if (focus_i is not None and i == focus_i) else 2

        cv2.rectangle(frame, (x, y), (x + w, y + h), color, thickness)

        txt = f"{prefix}{label}" if unknown else f"{prefix}{label} ({dist:.3f})"
        cv2.putText(frame, txt, (x, max(20, y - 10)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)


def draw_parcels(frame, parcels):
    for p in parcels:
        x1, y1, x2, y2 = p["x1"], p["y1"], p["x2"], p["y2"]
        cls_name = p["cls_name"]
        conf = p["conf"]

        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 180, 0), 2)
        cv2.putText(frame, f"PARCEL ({cls_name}) {conf:.2f}",
                    (x1, max(20, y1 - 10)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)