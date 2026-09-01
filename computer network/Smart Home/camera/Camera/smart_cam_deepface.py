import json
import time
import threading
from datetime import datetime
from pathlib import Path

import cv2
import numpy as np
from deepface import DeepFace

MODEL_NAME = "Facenet"
DETECTOR = "opencv"
THRESHOLD = 0.30
MARGIN = 0.06
RESIZE_WIDTH = 320
INFER_EVERY_SEC = 0.6
UNKNOWN_COOLDOWN_SEC = 5

DB_FILE = Path("data/deepface_db.npz")
EVENT_LOG = Path("logs/events.jsonl")


def load_db():
    if DB_FILE.exists():
        data = np.load(DB_FILE, allow_pickle=True)
        return {"names": list(data["names"]), "embeddings": list(data["embeddings"])}
    return {"names": [], "embeddings": []}


def save_db(db):
    DB_FILE.parent.mkdir(parents=True, exist_ok=True)
    np.savez(
        DB_FILE,
        names=np.array(db["names"], dtype=object),
        embeddings=np.array(db["embeddings"], dtype=object),
    )


def log_event(event: dict):
    EVENT_LOG.parent.mkdir(parents=True, exist_ok=True)
    with open(EVENT_LOG, "a", encoding="utf-8") as f:
        f.write(json.dumps(event) + "\n")


def resize_keep_aspect(frame, target_width):
    h, w = frame.shape[:2]
    if w <= target_width:
        return frame
    scale = target_width / w
    return cv2.resize(frame, (int(w * scale), int(h * scale)))


def cosine_distance(a, b):
    a = np.array(a, dtype=np.float32)
    b = np.array(b, dtype=np.float32)
    a = a / (np.linalg.norm(a) + 1e-8)
    b = b / (np.linalg.norm(b) + 1e-8)
    return 1.0 - float(np.dot(a, b))


def get_embedding(frame_bgr):
    try:
        reps = DeepFace.represent(
            img_path=frame_bgr,
            model_name=MODEL_NAME,
            detector_backend=DETECTOR,
            enforce_detection=False,
        )
        if isinstance(reps, list) and len(reps) >= 1 and "embedding" in reps[0]:
            return reps[0]["embedding"]
        return None
    except Exception:
        return None


def best_match(db, emb):
    if len(db["embeddings"]) == 0:
        return "UNKNOWN", 999.0

    dists = [cosine_distance(emb, e) for e in db["embeddings"]]
    best_i = int(np.argmin(dists))
    best_d = float(dists[best_i])

    if len(dists) >= 2:
        sorted_d = sorted(dists)
        second_best = float(sorted_d[1])
        gap = second_best - best_d
    else:
        gap = 999.0

    if best_d < THRESHOLD and gap > MARGIN:
        return db["names"][best_i], best_d

    return "UNKNOWN", best_d


class InferenceWorker:
    def __init__(self):
        self.lock = threading.Lock()
        self.latest_frame = None
        self.latest_result = ("NO_FACE", None)
        self.running = True
        self.busy = False
        self.last_infer_time = 0.0
        self.paused = False

    def submit_frame(self, frame_bgr):
        with self.lock:
            self.latest_frame = frame_bgr

    def get_result(self):
        with self.lock:
            return self.latest_result

    def set_paused(self, value: bool):
        with self.lock:
            self.paused = value

    def stop(self):
        self.running = False

    def loop(self, db, db_lock: threading.Lock):
        while self.running:
            time.sleep(0.01)

            with self.lock:
                if self.paused:
                    continue
                frame = self.latest_frame

            if frame is None or self.busy:
                continue

            now = time.time()
            if now - self.last_infer_time < INFER_EVERY_SEC:
                continue

            self.busy = True
            self.last_infer_time = now

            emb = get_embedding(frame)
            if emb is None:
                result = ("NO_FACE", None)
            else:
                with db_lock:
                    label, dist = best_match(db, emb)
                result = (label, dist)

            with self.lock:
                self.latest_result = result

            self.busy = False


def register_new_face(cap, db, db_lock: threading.Lock, worker: InferenceWorker, name: str, samples_needed=8):
    print(f"\n[REGISTER] {name}: need {samples_needed} samples.")
    print("Keep ONLY your face in view. Press SPACE to capture. Press q to cancel.\n")

    worker.set_paused(True)
    time.sleep(0.1)

    samples = []
    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                print("[REGISTER] webcam read failed.")
                return

            display = frame.copy()
            cv2.putText(
                display,
                f"REGISTER {name} | {len(samples)}/{samples_needed} | SPACE=capture | q=cancel",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (255, 255, 255),
                2,
            )
            cv2.imshow("Smart Cam", display)

            k = cv2.waitKey(1) & 0xFF
            if k == ord("q"):
                print("[REGISTER] cancelled.")
                return

            if k == 32:
                frame_small = resize_keep_aspect(frame, RESIZE_WIDTH)
                emb = get_embedding(frame_small)
                if emb is None:
                    print("[REGISTER] No face detected. Try again.")
                    continue

                samples.append(emb)
                print(f"[REGISTER] captured {len(samples)}/{samples_needed}")

                if len(samples) >= samples_needed:
                    break

        avg_emb = np.mean(np.array(samples, dtype=np.float32), axis=0).tolist()

        with db_lock:
            db["names"].append(name)
            db["embeddings"].append(avg_emb)
            save_db(db)

        print(f"[REGISTER] saved {name} ✅\n")

    finally:
        worker.set_paused(False)


def main():
    db = load_db()
    db_lock = threading.Lock()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Could not open webcam.")
        return

    worker = InferenceWorker()
    t = threading.Thread(target=worker.loop, args=(db, db_lock), daemon=True)
    t.start()

    print("Controls: r=register | q=quit")

    last_unknown_ts = 0
    fps_ema = 0.0
    alpha = 0.12
    prev = time.time()

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        frame_small = resize_keep_aspect(frame, RESIZE_WIDTH)
        worker.submit_frame(frame_small)

        label, dist = worker.get_result()

        now_ts = datetime.now().timestamp()
        if label == "UNKNOWN" and (now_ts - last_unknown_ts) > UNKNOWN_COOLDOWN_SEC:
            last_unknown_ts = now_ts
            event = {
                "type": "unknown_face",
                "ts": datetime.now().isoformat(timespec="seconds"),
                "camera_id": "laptop_cam",
                "cosine_distance": round(float(dist), 3) if dist is not None else None,
            }
            print("[ALERT]", event)
            log_event(event)

        cur = time.time()
        inst_fps = 1.0 / max(1e-6, (cur - prev))
        prev = cur
        fps_ema = inst_fps if fps_ema == 0 else (alpha * inst_fps + (1 - alpha) * fps_ema)

        label_text = label if dist is None else f"{label} (cos={dist:.3f})"
        cv2.putText(frame, "r=register | q=quit", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(frame, label_text, (10, 65),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8,
                    (0, 0, 255) if label == "UNKNOWN" else (0, 255, 0), 2)
        cv2.putText(frame, f"FPS: {fps_ema:.1f}", (10, frame.shape[0] - 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)

        cv2.imshow("Smart Cam", frame)
        k = cv2.waitKey(1) & 0xFF

        if k == ord("q"):
            break

        if k == ord("r"):
            name = input("Enter name to register: ").strip()
            if name:
                register_new_face(cap, db, db_lock, worker, name)
            else:
                print("[REGISTER] empty name, cancelled.")

    worker.stop()
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()