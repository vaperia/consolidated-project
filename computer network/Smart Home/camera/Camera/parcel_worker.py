# parcel_worker.py
import time
import threading
from typing import List, Dict, Optional

import numpy as np


class ParcelWorker:
    """
    Background YOLO parcel-like detection.
    Returns detections in ORIGINAL frame coords:
      {"x1","y1","x2","y2","cls_name","conf"}
    """
    def __init__(self, model_path: str, classes_allow: set,
                 conf: float, iou: float, infer_every_sec: float,
                 roi_y_start: float):
        from ultralytics import YOLO  # import here so project still runs without YOLO until needed

        self.model = YOLO(model_path)
        self.allow = set(classes_allow)
        self.conf = conf
        self.iou = iou
        self.infer_every_sec = infer_every_sec
        self.roi_y_start = roi_y_start

        self.lock = threading.Lock()
        self.running = True
        self.last_infer_time = 0.0
        self.latest_frame = None  # original frame
        self.latest_parcels: List[Dict] = []

    def submit_frame(self, frame_bgr):
        with self.lock:
            self.latest_frame = frame_bgr

    def get_parcels(self) -> List[Dict]:
        with self.lock:
            return list(self.latest_parcels)

    def stop(self):
        self.running = False

    def loop(self):
        while self.running:
            time.sleep(0.01)

            with self.lock:
                frame = self.latest_frame

            if frame is None:
                continue

            now = time.time()
            if now - self.last_infer_time < self.infer_every_sec:
                continue
            self.last_infer_time = now

            H, W = frame.shape[:2]
            y0 = int(H * self.roi_y_start)
            roi = frame[y0:H, 0:W]

            # YOLO inference
            try:
                results = self.model.predict(
                    roi,
                    conf=self.conf,
                    iou=self.iou,
                    verbose=False
                )
            except Exception:
                with self.lock:
                    self.latest_parcels = []
                continue

            dets: List[Dict] = []
            if results and len(results) > 0:
                r = results[0]
                names = r.names

                if r.boxes is not None and len(r.boxes) > 0:
                    boxes = r.boxes.xyxy.cpu().numpy()
                    confs = r.boxes.conf.cpu().numpy()
                    clss = r.boxes.cls.cpu().numpy().astype(int)

                    for (x1, y1, x2, y2), cf, ci in zip(boxes, confs, clss):
                        cls_name = names.get(int(ci), str(int(ci)))
                        if cls_name not in self.allow:
                            continue

                        # map ROI coords back to original frame coords
                        dets.append({
                            "x1": int(x1),
                            "y1": int(y1 + y0),
                            "x2": int(x2),
                            "y2": int(y2 + y0),
                            "cls_name": cls_name,
                            "conf": float(cf),
                        })

            with self.lock:
                self.latest_parcels = dets