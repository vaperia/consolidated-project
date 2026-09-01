# tracker.py
import math
from dataclasses import dataclass
from typing import Dict, List, Tuple


def iou(a, b) -> float:
    ax, ay, aw, ah = a
    bx, by, bw, bh = b

    ax2, ay2 = ax + aw, ay + ah
    bx2, by2 = bx + bw, by + bh

    ix1, iy1 = max(ax, bx), max(ay, by)
    ix2, iy2 = min(ax2, bx2), min(ay2, by2)

    iw, ih = max(0, ix2 - ix1), max(0, iy2 - iy1)
    inter = iw * ih
    if inter <= 0:
        return 0.0

    union = aw * ah + bw * bh - inter
    return inter / max(1e-6, union)


@dataclass
class Track:
    track_id: int
    x: float
    y: float
    w: float
    h: float
    label: str
    dist: float
    misses: int = 0
    vx: float = 0.0
    vy: float = 0.0

    def bbox(self) -> Tuple[float, float, float, float]:
        return (self.x, self.y, self.w, self.h)

    def center(self) -> Tuple[float, float]:
        return (self.x + self.w / 2.0, self.y + self.h / 2.0)

    def predict(self):
        self.x += self.vx
        self.y += self.vy

    def update_from_det(self, det: dict, smooth: float = 0.70):
        cx_old, cy_old = self.center()

        x2, y2, w2, h2 = float(det["x"]), float(det["y"]), float(det["w"]), float(det["h"])
        cx_new, cy_new = (x2 + w2 / 2.0), (y2 + h2 / 2.0)

        self.vx = 0.7 * self.vx + 0.3 * (cx_new - cx_old)
        self.vy = 0.7 * self.vy + 0.3 * (cy_new - cy_old)

        self.x = smooth * self.x + (1 - smooth) * x2
        self.y = smooth * self.y + (1 - smooth) * y2
        self.w = smooth * self.w + (1 - smooth) * w2
        self.h = smooth * self.h + (1 - smooth) * h2

        self.label = str(det["label"])
        self.dist = float(det["dist"])
        self.misses = 0


class BetterTracker:
    def __init__(self, max_misses: int = 18, min_iou: float = 0.12,
                 max_center_dist: float = 220.0, smooth: float = 0.70):
        self.max_misses = max_misses
        self.min_iou = min_iou
        self.max_center_dist = max_center_dist
        self.smooth = smooth

        self.next_id = 1
        self.tracks: Dict[int, Track] = {}

    def update(self, detections: List[dict]) -> Dict[int, Track]:
        for tr in self.tracks.values():
            tr.predict()

        if not self.tracks:
            for d in detections:
                self._create_track(d)
            return self.tracks

        if not detections:
            self._age_tracks()
            return self.tracks

        track_ids = list(self.tracks.keys())
        det_used = set()
        track_used = set()

        pairs = []
        for tid in track_ids:
            tr = self.tracks[tid]
            tb = tr.bbox()
            tcx, tcy = tr.center()

            for di, d in enumerate(detections):
                db = (float(d["x"]), float(d["y"]), float(d["w"]), float(d["h"]))
                dcx = db[0] + db[2] / 2.0
                dcy = db[1] + db[3] / 2.0

                cd = math.hypot(tcx - dcx, tcy - dcy)
                if cd > self.max_center_dist:
                    continue

                ov = iou(tb, db)
                if ov < self.min_iou:
                    continue

                score = ov * 1000.0 - cd
                pairs.append((score, tid, di))

        pairs.sort(reverse=True, key=lambda x: x[0])

        for score, tid, di in pairs:
            if tid in track_used or di in det_used:
                continue
            track_used.add(tid)
            det_used.add(di)
            self.tracks[tid].update_from_det(detections[di], smooth=self.smooth)

        for tid in list(self.tracks.keys()):
            if tid not in track_used:
                self.tracks[tid].misses += 1
                if self.tracks[tid].misses > self.max_misses:
                    del self.tracks[tid]

        for di, d in enumerate(detections):
            if di not in det_used:
                self._create_track(d)

        return self.tracks

    def _age_tracks(self):
        for tid in list(self.tracks.keys()):
            self.tracks[tid].misses += 1
            if self.tracks[tid].misses > self.max_misses:
                del self.tracks[tid]

    def _create_track(self, d: dict):
        tid = self.next_id
        self.next_id += 1
        self.tracks[tid] = Track(
            track_id=tid,
            x=float(d["x"]), y=float(d["y"]), w=float(d["w"]), h=float(d["h"]),
            label=str(d["label"]), dist=float(d["dist"]),
            misses=0
        )