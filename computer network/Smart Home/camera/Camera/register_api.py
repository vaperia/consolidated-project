# register_api.py
import json
import subprocess
import sys
import time
import threading
from pathlib import Path
from typing import Optional, Dict, Tuple

import cv2
import config
from vision import resize_keep_aspect, represent_multi, crop_from_facial_area

REG_DIR = Path("data/register_sessions")


class RegisterSession:
    def __init__(self):
        self.lock = threading.Lock()
        self.active = False
        self.name: Optional[str] = None
        self.target_samples: int = config.REGISTER_SAMPLES
        self.started_at: float = 0.0
        self.session_id: Optional[str] = None
        self.captured: int = 0

    def start(self, name: str, target_samples: int):
        safe_name = "".join(ch for ch in name if ch.isalnum() or ch in ("_", "-")).strip() or "user"
        sid = f"{int(time.time())}_{safe_name}"

        with self.lock:
            self.active = True
            self.name = name
            self.target_samples = int(target_samples)
            self.started_at = time.time()
            self.session_id = sid
            self.captured = 0

        folder = REG_DIR / sid
        folder.mkdir(parents=True, exist_ok=True)
        for p in folder.glob("*.jpg"):
            try:
                p.unlink()
            except Exception:
                pass

    def stop(self):
        with self.lock:
            self.active = False
            self.name = None
            self.session_id = None
            self.captured = 0

    def status(self) -> Dict:
        with self.lock:
            return {
                "active": self.active,
                "name": self.name,
                "captured": self.captured,
                "target": self.target_samples,
                "started_at": self.started_at,
                "session_id": self.session_id,
            }

    def add_capture(self):
        with self.lock:
            self.captured += 1

    def folder(self) -> Optional[Path]:
        with self.lock:
            if not self.session_id:
                return None
            return REG_DIR / self.session_id


register_session = RegisterSession()


def detect_single_face_and_crop(frame_bgr) -> Tuple[Optional[any], Optional[str]]:
    if frame_bgr is None or frame_bgr.size == 0:
        return None, "Invalid frame."

    reps = represent_multi(frame_bgr, config.MODEL_NAME, config.DETECTOR)

    if len(reps) == 0:
        return None, "No face detected."
    if len(reps) > 1:
        return None, f"Multiple faces detected ({len(reps)}). Keep only 1 face."

    area = reps[0].get("facial_area", {})
    crop = crop_from_facial_area(frame_bgr, area, pad_ratio=0.18)
    if crop is None or crop.size == 0:
        return None, "Face crop failed."

    h, w = crop.shape[:2]
    if min(h, w) < 120:
        return None, "Face too small. Move closer to the camera."

    return crop, None


def save_capture_image(frame_bgr) -> Tuple[bool, str, Dict]:
    st = register_session.status()
    if not st["active"]:
        return False, "No active registration session.", st

    if st["captured"] >= st["target"]:
        return False, "Target samples already reached. Click Finish & Save.", st

    folder = register_session.folder()
    if folder is None:
        return False, "Session folder missing.", st

    frame_small = resize_keep_aspect(frame_bgr, config.RESIZE_WIDTH)
    crop, err = detect_single_face_and_crop(frame_small)
    if err:
        return False, err, register_session.status()

    idx = st["captured"] + 1
    out_path = folder / f"{idx:02d}.jpg"

    ok = cv2.imwrite(str(out_path), crop, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
    if not ok:
        return False, "Failed to save snapshot.", register_session.status()

    register_session.add_capture()
    new_st = register_session.status()

    if new_st["captured"] >= new_st["target"]:
        return True, f"Saved sample {idx}. Target reached — click Finish & Save.", new_st

    return True, f"Saved sample {idx}", new_st


def finish_and_embed(db: dict, db_lock: threading.Lock) -> Tuple[bool, str]:
    st = register_session.status()
    if not st["active"] or not st["name"]:
        return False, "No active session."

    folder = register_session.folder()
    if folder is None:
        return False, "Session folder missing."

    images = sorted(folder.glob("*.jpg"))
    if len(images) < st["target"]:
        return False, f"Not enough samples ({len(images)}/{st['target']})."

    worker_script = Path(__file__).with_name("register_worker.py")

    try:
        result = subprocess.run(
            [
                sys.executable,
                str(worker_script),
                str(folder),
                str(st["name"]),
                str(st["target"]),
                str(config.DB_FILE),
            ],
            capture_output=True,
            text=True,
            timeout=180,
        )
    except subprocess.TimeoutExpired:
        return False, "Registration timed out during embedding."
    except Exception as e:
        return False, f"Failed to start register worker: {type(e).__name__}: {str(e)}"

    stdout = (result.stdout or "").strip()
    stderr = (result.stderr or "").strip()

    if not stdout:
        return False, f"Worker crashed with no output. stderr: {stderr[:300]}"

    try:
        payload = json.loads(stdout.splitlines()[-1])
    except Exception:
        return False, f"Worker returned invalid output: {stdout[:300]}"

    if not payload.get("ok"):
        return False, payload.get("error", "Unknown worker failure")

    register_session.stop()
    return True, payload.get("message", "Registration successful.")
