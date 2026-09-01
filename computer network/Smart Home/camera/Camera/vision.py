# vision.py
import numpy as np
from deepface import DeepFace


def resize_keep_aspect(frame, target_width: int):
    h, w = frame.shape[:2]
    if w <= target_width:
        return frame
    scale = target_width / w
    import cv2
    return cv2.resize(frame, (int(w * scale), int(h * scale)))


def cosine_distance(a, b):
    a = np.array(a, dtype=np.float32)
    b = np.array(b, dtype=np.float32)
    a = a / (np.linalg.norm(a) + 1e-8)
    b = b / (np.linalg.norm(b) + 1e-8)
    return 1.0 - float(np.dot(a, b))


def _valid_face_detection(frame_bgr, r, min_face_ratio: float = 0.12,
                          edge_margin_ratio: float = 0.02,
                          min_confidence: float = 0.80):
    if not isinstance(r, dict) or 'embedding' not in r or 'facial_area' not in r:
        return False

    facial_area = r.get('facial_area') or {}
    h, w = frame_bgr.shape[:2]

    x = int(facial_area.get('x', 0))
    y = int(facial_area.get('y', 0))
    fw = int(facial_area.get('w', 0))
    fh = int(facial_area.get('h', 0))

    if fw <= 0 or fh <= 0:
        return False

    # Reject tiny detections. These are often ghost faces from textures/backgrounds.
    if fw < int(w * min_face_ratio) or fh < int(h * min_face_ratio):
        return False

    # Reject detections hugging the frame edge too tightly.
    margin_x = int(w * edge_margin_ratio)
    margin_y = int(h * edge_margin_ratio)
    if x <= margin_x or y <= margin_y or (x + fw) >= (w - margin_x) or (y + fh) >= (h - margin_y):
        return False

    # Reject very stretched boxes.
    aspect = fw / max(fh, 1)
    if aspect < 0.65 or aspect > 1.55:
        return False

    conf = r.get('face_confidence', r.get('confidence', None))
    if conf is not None:
        try:
            if float(conf) < min_confidence:
                return False
        except Exception:
            pass

    return True


def represent_multi(frame_bgr, model_name: str, detector: str,
                    min_face_ratio: float = 0.12,
                    edge_margin_ratio: float = 0.02,
                    min_confidence: float = 0.80):
    try:
        reps = DeepFace.represent(
            img_path=frame_bgr,
            model_name=model_name,
            detector_backend=detector,
            enforce_detection=True
        )
        if not isinstance(reps, list):
            return []

        out = []
        for r in reps:
            if _valid_face_detection(
                frame_bgr, r,
                min_face_ratio=min_face_ratio,
                edge_margin_ratio=edge_margin_ratio,
                min_confidence=min_confidence,
            ):
                out.append(r)
        return out
    except Exception:
        return []


def crop_from_facial_area(frame_bgr, facial_area: dict, pad_ratio: float = 0.18):
    if frame_bgr is None or frame_bgr.size == 0 or not facial_area:
        return None

    h, w = frame_bgr.shape[:2]
    x = int(facial_area.get("x", 0))
    y = int(facial_area.get("y", 0))
    fw = int(facial_area.get("w", 0))
    fh = int(facial_area.get("h", 0))

    if fw <= 0 or fh <= 0:
        return None

    pad = int(max(fw, fh) * pad_ratio)
    x1 = max(0, x - pad)
    y1 = max(0, y - pad)
    x2 = min(w, x + fw + pad)
    y2 = min(h, y + fh + pad)

    crop = frame_bgr[y1:y2, x1:x2].copy()
    if crop.size == 0:
        return None
    return crop


def match_with_margin(db: dict, emb, threshold: float, margin: float):
    if len(db["embeddings"]) == 0:
        return "UNKNOWN", 999.0

    per_name = {}
    for name, ref_emb in zip(db["names"], db["embeddings"]):
        d = cosine_distance(emb, ref_emb)
        if name not in per_name or d < per_name[name]:
            per_name[name] = d

    if not per_name:
        return "UNKNOWN", 999.0

    ranked = sorted(per_name.items(), key=lambda x: x[1])
    best_name, best_d = ranked[0]

    if len(ranked) >= 2:
        second_d = float(ranked[1][1])
        gap = second_d - best_d
    else:
        gap = 999.0

    if best_d < threshold and gap > margin:
        return best_name, float(best_d)

    return "UNKNOWN", float(best_d)
