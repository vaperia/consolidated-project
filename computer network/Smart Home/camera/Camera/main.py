# main.py
import time
import threading
from datetime import datetime

import cv2

import config
from db import load_db, save_db, add_templates
from events import log_event
from vision import resize_keep_aspect
from face_worker import FaceWorker
from parcel_worker import ParcelWorker
from tracker import BetterTracker
from register import register_new_face
from overlay import (
    draw_ring_header,
    draw_ring_footer,
    draw_banner,
    draw_focus_zones,
    pick_focus_target,
    draw_faces,
    draw_parcels
)


def main():
    db = load_db(config.DB_FILE)
    db_lock = threading.Lock()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Could not open webcam.")
        return

    # Face worker thread
    face_worker = FaceWorker(
        infer_every_sec=config.FACE_INFER_EVERY_SEC,
        model_name=config.MODEL_NAME,
        detector=config.DETECTOR,
        threshold=config.THRESHOLD,
        margin=config.MARGIN
    )
    tf = threading.Thread(target=face_worker.loop, args=(db, db_lock), daemon=True)
    tf.start()

    # Parcel worker thread (YOLO)
    parcel_worker = ParcelWorker(
        model_path=config.YOLO_MODEL,
        classes_allow=config.PARCEL_CLASSES,
        conf=config.PARCEL_CONF,
        iou=config.PARCEL_IOU,
        infer_every_sec=config.PARCEL_INFER_EVERY_SEC,
        roi_y_start=config.PARCEL_ROI_Y_START
    )
    tp = threading.Thread(target=parcel_worker.loop, daemon=True)
    tp.start()

    # Face tracker
    tracker = BetterTracker(
        max_misses=config.TRACK_MAX_MISSES,
        min_iou=config.TRACK_MIN_IOU,
        max_center_dist=config.TRACK_MAX_CENTER_DIST,
        smooth=config.TRACK_SMOOTH
    )

    print("Controls: r=register | q=quit")
    print("Ring UI + Face + Tracking + Parcel-like detection enabled.\n")

    # Cooldowns
    last_unknown_ts = 0.0
    last_parcel_ts = 0.0

    # Unlock gating
    unlock_seen_since = {}      # track_id -> first time seen as KNOWN
    unlock_cooldown_until = 0.0

    # FPS smoothing
    fps_ema = 0.0
    alpha = 0.12
    prev = time.time()

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        # Send frames to workers
        frame_small = resize_keep_aspect(frame, config.RESIZE_WIDTH)
        face_worker.submit_frame(frame_small)
        parcel_worker.submit_frame(frame)

        # Scale small->original
        h0, w0 = frame.shape[:2]
        hs, ws = frame_small.shape[:2]
        sx = w0 / ws
        sy = h0 / hs

        # Faces -> tracking
        faces = face_worker.get_faces()          # small coords
        tracks = tracker.update(faces)
        track_list = list(tracks.values())

        items = []
        for tr in track_list:
            items.append({
                "x": int(tr.x), "y": int(tr.y), "w": int(tr.w), "h": int(tr.h),
                "label": tr.label, "dist": float(tr.dist),
                "track_id": tr.track_id
            })

        # Pick focus
        focus_i = pick_focus_target(items, sx, sy, w0, h0)

        # Parcels (original coords)
        parcels = parcel_worker.get_parcels()

        # Counts
        unknown_count = sum(1 for it in items if it["label"] == "UNKNOWN")

        # Unknown event (cooldown)
        now_ts = time.time()
        if unknown_count > 0 and (now_ts - last_unknown_ts) > config.UNKNOWN_COOLDOWN_SEC:
            last_unknown_ts = now_ts
            event = {
                "type": "unknown_face_detected",
                "ts": datetime.now().isoformat(timespec="seconds"),
                "camera_id": "laptop_cam",
                "num_faces": len(items),
                "num_unknown": unknown_count,
                "unknown_track_ids": [it["track_id"] for it in items if it["label"] == "UNKNOWN"]
            }
            print("[ALERT]", event)
            log_event(config.EVENT_LOG, event)

        # Parcel event (cooldown) - if any parcel-like object appears
        if len(parcels) > 0 and (now_ts - last_parcel_ts) > config.PARCEL_COOLDOWN_SEC:
            last_parcel_ts = now_ts
            event = {
                "type": "parcel_detected",
                "ts": datetime.now().isoformat(timespec="seconds"),
                "camera_id": "laptop_cam",
                "count": len(parcels),
                "classes": sorted(list({p["cls_name"] for p in parcels}))
            }
            print("[PARCEL]", event)
            log_event(config.EVENT_LOG, event)

        # Unlock gating: known face held for 5 seconds
        current_ids = set(it["track_id"] for it in items)
        for tid in list(unlock_seen_since.keys()):
            if tid not in current_ids:
                del unlock_seen_since[tid]

        for it in items:
            tid = it["track_id"]
            label = it["label"]
            if label != "UNKNOWN":
                if tid not in unlock_seen_since:
                    unlock_seen_since[tid] = now_ts
            else:
                if tid in unlock_seen_since:
                    del unlock_seen_since[tid]

        if now_ts > unlock_cooldown_until:
            for it in items:
                tid = it["track_id"]
                label = it["label"]
                if label == "UNKNOWN":
                    continue
                held = now_ts - unlock_seen_since.get(tid, now_ts)
                if held >= config.UNLOCK_HOLD_SEC:
                    unlock_cooldown_until = now_ts + config.UNLOCK_COOLDOWN_SEC
                    event = {
                        "type": "unlock_request",
                        "ts": datetime.now().isoformat(timespec="seconds"),
                        "person": label,
                        "track_id": tid,
                        "held_seconds": round(held, 2)
                    }
                    print("[UNLOCK]", event)
                    log_event(config.EVENT_LOG, event)
                    break

        # FPS
        cur = time.time()
        inst_fps = 1.0 / max(1e-6, (cur - prev))
        prev = cur
        fps_ema = inst_fps if fps_ema == 0 else (alpha * inst_fps + (1 - alpha) * fps_ema)

        # ---- UI (Clean Ring) ----
        draw_ring_header(frame, camera_name=config.CAMERA_NAME, live_dot=config.SHOW_LIVE_DOT)

        # Optional center guide
        draw_focus_zones(frame, inner_size=config.FOCUS_INNER_SIZE, outer_size=config.FOCUS_OUTER_SIZE)

        # Draw parcels + faces
        draw_parcels(frame, parcels)
        draw_faces(frame, items, sx, sy, focus_i=focus_i)

        # Banners
        if len(parcels) > 0:
            draw_banner(frame, "Parcel arrived", kind="info")
        if unknown_count > 0:
            draw_banner(frame, f"Unrecognized person detected ({unknown_count})", kind="alert")

        # Footer
        draw_ring_footer(frame, fps=fps_ema, faces=len(items))

        cv2.imshow("Smart Cam", frame)
        k = cv2.waitKey(1) & 0xFF

        if k == ord("q"):
            break

        if k == ord("r"):
            name = input("Enter name to register: ").strip()
            if name:
                register_new_face(
                    cap=cap,
                    db=db,
                    db_lock=db_lock,
                    face_worker=face_worker,
                    name=name,
                    register_samples=config.REGISTER_SAMPLES,
                    resize_width=config.RESIZE_WIDTH,
                    model_name=config.MODEL_NAME,
                    detector=config.DETECTOR,
                    save_db_fn=save_db,
                    add_templates_fn=add_templates,
                    db_file_path=config.DB_FILE
                )

    face_worker.stop()
    parcel_worker.stop()
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()