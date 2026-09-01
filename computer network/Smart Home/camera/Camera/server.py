import io
import time
import threading
from datetime import datetime
from collections import deque
from typing import Optional

import cv2
from fastapi import FastAPI
from fastapi.responses import StreamingResponse, JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

import config
from db import load_db
from events import log_event
from vision import resize_keep_aspect
from face_worker import FaceWorker
from parcel_worker import ParcelWorker
from tracker import BetterTracker
from overlay import (
    draw_ring_header,
    draw_ring_footer,
    draw_banner,
    draw_focus_zones,
    pick_focus_target,
    draw_faces,
    draw_parcels,
)
from register_api import register_session, save_capture_image, finish_and_embed

status_lock = threading.Lock()
camera_status = {
    "camera_name": config.CAMERA_NAME,
    "online": False,
    "faces": 0,
    "unknown_count": 0,
    "parcels": 0,
    "recognized_name": None,
    "last_event": None,
    "ts": None,
}

event_buffer = deque(maxlen=200)

latest_jpeg_lock = threading.Lock()
latest_jpeg: Optional[bytes] = None

latest_frame_lock = threading.Lock()
latest_frame_bgr = None

clip_lock = threading.Lock()
clip_recording = False
clip_frames: list = []
clip_target_count = 0
clip_ready_event = threading.Event()

db_lock = threading.Lock()
db = {"names": [], "embeddings": []}

face_worker = None
parcel_worker = None

app = FastAPI(title="Smart Cam Service", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def push_event(ev: dict):
    with status_lock:
        camera_status["last_event"] = ev
        camera_status["ts"] = ev.get("ts")

    event_buffer.appendleft(ev)

    try:
        log_event(config.EVENT_LOG, ev)
    except Exception:
        pass


def camera_loop():
    global latest_jpeg, latest_frame_bgr
    global clip_recording, clip_frames, clip_target_count
    global face_worker, parcel_worker

    fresh = load_db(config.DB_FILE)
    with db_lock:
        db["names"].clear()
        db["names"].extend(fresh["names"])
        db["embeddings"].clear()
        db["embeddings"].extend(fresh["embeddings"])

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        with status_lock:
            camera_status["online"] = False
        print("[CAM] Could not open webcam.")
        return

    face_worker = FaceWorker(
        infer_every_sec=config.FACE_INFER_EVERY_SEC,
        model_name=config.MODEL_NAME,
        detector=config.DETECTOR,
        threshold=config.THRESHOLD,
        margin=config.MARGIN,
    )
    tf = threading.Thread(target=face_worker.loop, args=(db, db_lock), daemon=True)
    tf.start()

    parcel_worker = ParcelWorker(
        model_path=config.YOLO_MODEL,
        classes_allow=config.PARCEL_CLASSES,
        conf=config.PARCEL_CONF,
        iou=config.PARCEL_IOU,
        infer_every_sec=config.PARCEL_INFER_EVERY_SEC,
        roi_y_start=config.PARCEL_ROI_Y_START,
    )
    tp = threading.Thread(target=parcel_worker.loop, daemon=True)
    tp.start()

    tracker = BetterTracker(
        max_misses=config.TRACK_MAX_MISSES,
        min_iou=config.TRACK_MIN_IOU,
        max_center_dist=config.TRACK_MAX_CENTER_DIST,
        smooth=config.TRACK_SMOOTH,
    )

    last_unknown_alert_ts = 0.0
    last_parcel_alert_ts = 0.0
    last_recognized_alert_ts = 0.0

    fps_ema = 0.0
    alpha = 0.12
    prev = time.time()

    with status_lock:
        camera_status["online"] = True

    print("[CAM] Camera service running. MJPEG at /stream")

    while True:
        try:
            ok, frame = cap.read()
            if not ok:
                time.sleep(0.02)
                continue

            with latest_frame_lock:
                latest_frame_bgr = frame.copy()

            with clip_lock:
                if clip_recording:
                    clip_frames.append(frame.copy())
                    if len(clip_frames) >= clip_target_count:
                        clip_recording = False
                        clip_ready_event.set()

            frame_small = resize_keep_aspect(frame, config.RESIZE_WIDTH)

            if face_worker is not None:
                face_worker.submit_frame(frame_small)

            if parcel_worker is not None:
                parcel_worker.submit_frame(frame)

            h0, w0 = frame.shape[:2]
            hs, ws = frame_small.shape[:2]
            sx = w0 / ws
            sy = h0 / hs

            faces = face_worker.get_faces() if face_worker is not None else []
            tracks = tracker.update(faces)

            items = []
            for tr in tracks.values():
                items.append(
                    {
                        "x": int(tr.x),
                        "y": int(tr.y),
                        "w": int(tr.w),
                        "h": int(tr.h),
                        "label": tr.label,
                        "dist": float(tr.dist) if tr.dist is not None else None,
                        "track_id": tr.track_id,
                    }
                )

            parcels = parcel_worker.get_parcels() if parcel_worker is not None else []
            focus_i = pick_focus_target(items, sx, sy, w0, h0)

            unknown_count = sum(1 for it in items if it["label"] == "UNKNOWN")
            now_ts = time.time()

            recognized_name = None
            recognized_track_id = None
            recognized_dist = None

            for it in items:
                label = str(it.get("label") or "").strip()
                if label and label not in ("UNKNOWN", "NO_FACE"):
                    recognized_name = label
                    recognized_track_id = it.get("track_id")
                    recognized_dist = it.get("dist")
                    break

            if unknown_count > 0 and (now_ts - last_unknown_alert_ts) > config.UNKNOWN_COOLDOWN_SEC:
                last_unknown_alert_ts = now_ts
                ev = {
                    "type": "unknown_face_detected",
                    "ts": datetime.now().isoformat(timespec="seconds"),
                    "camera_id": "laptop_cam",
                    "num_faces": len(items),
                    "num_unknown": unknown_count,
                    "unknown_track_ids": [it["track_id"] for it in items if it["label"] == "UNKNOWN"],
                }
                push_event(ev)

            recognized_cooldown = getattr(config, "RECOGNIZED_COOLDOWN_SEC", 5.0)
            if recognized_name and (now_ts - last_recognized_alert_ts) > recognized_cooldown:
                last_recognized_alert_ts = now_ts
                ev = {
                    "type": "recognized_face_detected",
                    "ts": datetime.now().isoformat(timespec="seconds"),
                    "camera_id": "laptop_cam",
                    "name": recognized_name,
                    "track_id": recognized_track_id,
                    "dist": round(float(recognized_dist), 4) if recognized_dist is not None else None,
                }
                push_event(ev)

            if len(parcels) > 0 and (now_ts - last_parcel_alert_ts) > config.PARCEL_COOLDOWN_SEC:
                last_parcel_alert_ts = now_ts
                ev = {
                    "type": "parcel_detected",
                    "ts": datetime.now().isoformat(timespec="seconds"),
                    "camera_id": "laptop_cam",
                    "count": len(parcels),
                    "classes": sorted(list({p["cls_name"] for p in parcels})),
                }
                push_event(ev)

            with status_lock:
                camera_status["faces"] = len(items)
                camera_status["unknown_count"] = unknown_count
                camera_status["parcels"] = len(parcels)
                camera_status["recognized_name"] = recognized_name
                camera_status["online"] = True
                camera_status["camera_name"] = config.CAMERA_NAME
                camera_status["ts"] = datetime.now().isoformat(timespec="seconds")

            cur = time.time()
            inst_fps = 1.0 / max(1e-6, (cur - prev))
            prev = cur
            fps_ema = inst_fps if fps_ema == 0 else (alpha * inst_fps + (1 - alpha) * fps_ema)

            draw_ring_header(frame, camera_name=config.CAMERA_NAME, live_dot=config.SHOW_LIVE_DOT)
            draw_focus_zones(frame, inner_size=config.FOCUS_INNER_SIZE, outer_size=config.FOCUS_OUTER_SIZE)
            draw_parcels(frame, parcels)
            draw_faces(frame, items, sx, sy, focus_i=focus_i)

            if len(parcels) > 0:
                draw_banner(frame, "Parcel arrived", kind="info")
            if unknown_count > 0:
                draw_banner(frame, f"Unrecognized person detected ({unknown_count})", kind="alert")
            elif recognized_name:
                draw_banner(frame, f"Recognized: {recognized_name}", kind="info")

            draw_ring_footer(frame, fps=fps_ema, faces=len(items))

            ok2, buf = cv2.imencode(".jpg", frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
            if ok2:
                with latest_jpeg_lock:
                    latest_jpeg = buf.tobytes()

        except Exception as e:
            print(f"[CAM LOOP ERROR] {type(e).__name__}: {e}")
            time.sleep(0.1)


@app.on_event("startup")
def startup_event():
    t = threading.Thread(target=camera_loop, daemon=True)
    t.start()


@app.get("/health")
def health():
    return {"ok": True, "service": "camera"}


@app.get("/api/camera/status")
def get_status():
    with status_lock:
        return JSONResponse(camera_status)


@app.get("/api/camera/events")
def get_events(limit: int = 20):
    limit = max(1, min(200, int(limit)))
    return JSONResponse(list(event_buffer)[:limit])


def mjpeg_generator():
    boundary = b"--frame"
    while True:
        with latest_jpeg_lock:
            frame = latest_jpeg

        if frame is None:
            time.sleep(0.05)
            continue

        yield boundary + b"\r\n"
        yield b"Content-Type: image/jpeg\r\n"
        yield b"Content-Length: " + str(len(frame)).encode() + b"\r\n\r\n"
        yield frame + b"\r\n"
        time.sleep(0.03)


@app.get("/stream")
def stream():
    return StreamingResponse(
        mjpeg_generator(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


@app.get("/view", response_class=HTMLResponse)
def view_page():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Smart Cam</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
            body {
                margin: 0;
                background: #111;
                color: white;
                font-family: Arial, sans-serif;
                text-align: center;
            }
            h2 {
                margin: 12px 0;
            }
            img {
                width: 100%;
                max-width: 900px;
                height: auto;
                border-radius: 12px;
            }
            .wrap {
                padding: 12px;
            }
        </style>
    </head>
    <body>
        <div class="wrap">
            <h2>Smart Cam Live View</h2>
            <img src="/stream" alt="Live camera stream" />
        </div>
    </body>
    </html>
    """


@app.get("/api/camera/snapshot")
def snapshot():
    with latest_jpeg_lock:
        frame = latest_jpeg
    if frame is None:
        return JSONResponse({"error": "No frame yet."}, status_code=503)
    return StreamingResponse(io.BytesIO(frame), media_type="image/jpeg")


@app.post("/api/camera/clip")
def record_clip(duration: int = 10):
    import tempfile
    import os
    import cv2 as _cv2

    duration = max(3, min(30, int(duration)))
    estimated_fps = 20
    target_frames = estimated_fps * duration

    with clip_lock:
        global clip_recording, clip_frames, clip_target_count
        clip_frames = []
        clip_target_count = target_frames
        clip_recording = True
        clip_ready_event.clear()

    clip_ready_event.wait(timeout=duration + 5)

    with clip_lock:
        frames_snapshot = list(clip_frames)
        clip_recording = False

    if not frames_snapshot:
        return JSONResponse({"error": "No frames captured."}, status_code=503)

    try:
        h, w = frames_snapshot[0].shape[:2]
        tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
        tmp.close()

        fourcc = _cv2.VideoWriter_fourcc(*"mp4v")
        out = _cv2.VideoWriter(tmp.name, fourcc, estimated_fps, (w, h))
        for f in frames_snapshot:
            out.write(f)
        out.release()

        with open(tmp.name, "rb") as fh:
            mp4_bytes = fh.read()
        os.unlink(tmp.name)

        return StreamingResponse(io.BytesIO(mp4_bytes), media_type="video/mp4")
    except Exception as e:
        return JSONResponse({"error": f"Encoding failed: {e}"}, status_code=500)


@app.get("/api/register/status")
def register_status():
    return register_session.status()


@app.post("/api/register/start")
def register_start(name: str, samples: int = config.REGISTER_SAMPLES):
    global face_worker

    name = (name or "").strip()
    if not name:
        return JSONResponse({"ok": False, "error": "Name is required."}, status_code=400)

    register_session.start(name=name, target_samples=int(samples))

    if face_worker is not None:
        face_worker.set_paused(True)

    return {"ok": True, "status": register_session.status()}


@app.post("/api/register/capture")
def register_capture():
    global face_worker

    if face_worker is None:
        return JSONResponse({"ok": False, "error": "Face worker not ready."}, status_code=503)

    face_worker.set_paused(True)
    time.sleep(0.2)

    try:
        with latest_frame_lock:
            frame = None if latest_frame_bgr is None else latest_frame_bgr.copy()

        if frame is None:
            return JSONResponse({"ok": False, "error": "No camera frame yet."}, status_code=500)

        ok, msg, st = save_capture_image(frame)
        if not ok:
            return JSONResponse({"ok": False, "error": msg, "status": st}, status_code=400)

        return {"ok": True, "message": msg, "status": st}

    except Exception as e:
        return JSONResponse({"ok": False, "error": f"Register capture crashed: {e}"}, status_code=500)

    finally:
        if face_worker is not None:
            face_worker.set_paused(False)


@app.post("/api/register/finish")
def register_finish():
    global face_worker

    if face_worker is not None:
        face_worker.set_paused(True)
        time.sleep(0.2)

    try:
        ok, msg = finish_and_embed(db=db, db_lock=db_lock)
        if not ok:
            return JSONResponse({"ok": False, "error": msg}, status_code=400)

        fresh = load_db(config.DB_FILE)
        with db_lock:
            db["names"].clear()
            db["names"].extend(fresh["names"])
            db["embeddings"].clear()
            db["embeddings"].extend(fresh["embeddings"])

        push_event(
            {
                "type": "face_registered",
                "ts": datetime.now().isoformat(timespec="seconds"),
                "message": msg,
            }
        )

        return {"ok": True, "message": msg}

    except Exception as e:
        return JSONResponse({"ok": False, "error": f"Register finish crashed: {e}"}, status_code=500)

    finally:
        if face_worker is not None:
            face_worker.set_paused(False)