# face_worker.py
import time
import threading
from typing import List, Dict

from vision import represent_multi, match_with_margin


class FaceWorker:
    """
    Background face scanning:
    - takes SMALL frame
    - DeepFace represent_multi
    - match each face to DB
    Output in SMALL coords: {"x","y","w","h","label","dist"}
    """
    def __init__(self, infer_every_sec: float, model_name: str, detector: str,
                 threshold: float, margin: float):
        self.infer_every_sec = infer_every_sec
        self.model_name = model_name
        self.detector = detector
        self.threshold = threshold
        self.margin = margin

        self.lock = threading.Lock()
        self.running = True
        self.paused = False
        self.last_infer_time = 0.0
        self.latest_frame_small = None
        self.latest_faces: List[Dict] = []

    def submit_frame(self, frame_small):
        with self.lock:
            self.latest_frame_small = frame_small

    def get_faces(self) -> List[Dict]:
        with self.lock:
            return list(self.latest_faces)

    def set_paused(self, value: bool):
        with self.lock:
            self.paused = value

    def stop(self):
        self.running = False

    def loop(self, db: dict, db_lock: threading.Lock):
        while self.running:
            time.sleep(0.02)

            with self.lock:
                if self.paused:
                    continue
                frame = self.latest_frame_small

            if frame is None:
                continue

            now = time.time()
            if now - self.last_infer_time < self.infer_every_sec:
                continue

            self.last_infer_time = now

            reps = represent_multi(
                frame, self.model_name, self.detector,
                min_face_ratio=getattr(__import__("config"), "MIN_FACE_RATIO", 0.12),
                edge_margin_ratio=getattr(__import__("config"), "EDGE_MARGIN_RATIO", 0.02),
                min_confidence=getattr(__import__("config"), "MIN_DETECT_CONFIDENCE", 0.80),
            )
            faces = []

            for r in reps:
                area = r["facial_area"]
                emb = r["embedding"]
                with db_lock:
                    label, dist = match_with_margin(db, emb, self.threshold, self.margin)

                faces.append({
                    "x": int(area.get("x", 0)),
                    "y": int(area.get("y", 0)),
                    "w": int(area.get("w", 0)),
                    "h": int(area.get("h", 0)),
                    "label": label,
                    "dist": float(dist),
                })

            with self.lock:
                self.latest_faces = faces