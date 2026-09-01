# register.py
import time
import cv2

from vision import resize_keep_aspect, represent_multi


def register_new_face(cap, db, db_lock, face_worker,
                      name: str, register_samples: int,
                      resize_width: int, model_name: str, detector: str,
                      save_db_fn, add_templates_fn, db_file_path: str):
    print(f"\n[REGISTER] {name}: need {register_samples} samples.")
    print("Tips: good lighting, face closer, vary angles slightly.")
    print("Keep ONLY this person in frame. SPACE=capture, q=cancel.\n")

    face_worker.set_paused(True)
    time.sleep(0.15)

    samples = []
    status_msg = "Press SPACE to capture"
    status_color = (255, 255, 255)

    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                print("[REGISTER] webcam read failed.")
                return

            display = frame.copy()

            # header
            cv2.putText(
                display,
                f"REGISTER {name} | {len(samples)}/{register_samples} | SPACE=capture | q=cancel",
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (255, 255, 255),
                2
            )

            # center guide box
            h, w = display.shape[:2]
            box_w = int(w * 0.38)
            box_h = int(h * 0.55)
            x1 = (w - box_w) // 2
            y1 = (h - box_h) // 2
            x2 = x1 + box_w
            y2 = y1 + box_h
            cv2.rectangle(display, (x1, y1), (x2, y2), (180, 180, 180), 2)

            # status line
            cv2.putText(
                display,
                status_msg,
                (10, 65),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                status_color,
                2
            )

            cv2.imshow("Smart Cam", display)
            k = cv2.waitKey(1) & 0xFF

            if k == ord("q"):
                print("[REGISTER] cancelled.")
                return

            if k == 32:  # SPACE
                status_msg = "Checking captured frame..."
                status_color = (0, 255, 255)

                # freeze current frame and run detection only now
                frame_small = resize_keep_aspect(frame, resize_width)
                reps = represent_multi(frame_small, model_name, detector)

                if len(reps) == 0:
                    print("[REGISTER] No face detected. Try again.")
                    status_msg = "No face detected - try again"
                    status_color = (0, 0, 255)
                    continue

                if len(reps) > 1:
                    print("[REGISTER] Multiple faces detected. Keep only 1 person in frame.")
                    status_msg = "Multiple faces detected - only 1 person allowed"
                    status_color = (0, 0, 255)
                    continue

                samples.append(reps[0]["embedding"])
                print(f"[REGISTER] captured {len(samples)}/{register_samples}")
                status_msg = f"Captured {len(samples)}/{register_samples}"
                status_color = (0, 255, 0)

                if len(samples) >= register_samples:
                    break

        with db_lock:
            add_templates_fn(db, name, samples)
            save_db_fn(db_file_path, db)

        print(f"[REGISTER] saved {name} with {len(samples)} templates ✅\n")

    finally:
        face_worker.set_paused(False)