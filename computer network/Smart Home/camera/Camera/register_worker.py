# register_worker.py
import json
import sys
from pathlib import Path

import cv2
import numpy as np
from deepface import DeepFace

import config


def main():
    if len(sys.argv) != 5:
        print(json.dumps({"ok": False, "error": "Invalid arguments"}))
        sys.exit(1)

    session_folder = Path(sys.argv[1])
    name = sys.argv[2]
    target = int(sys.argv[3])
    db_file = Path(sys.argv[4])

    try:
        images = sorted(session_folder.glob("*.jpg"))
        if len(images) < target:
            print(json.dumps({"ok": False, "error": f"Not enough samples ({len(images)}/{target})."}))
            return

        embeddings = []
        failed_files = []

        for p in images[:target]:
            img = cv2.imread(str(p))
            if img is None:
                failed_files.append(f"{p.name}: unreadable")
                continue

            try:
                rep = DeepFace.represent(
                    img_path=img,
                    model_name=config.MODEL_NAME,
                    detector_backend="skip",
                    enforce_detection=False,
                    align=False,
                )

                if isinstance(rep, list) and len(rep) > 0 and "embedding" in rep[0]:
                    embeddings.append(rep[0]["embedding"])
                else:
                    failed_files.append(f"{p.name}: no embedding returned")
            except Exception as e:
                failed_files.append(f"{p.name}: {type(e).__name__}: {str(e)}")

        # allow a few bad samples instead of failing the whole registration
        min_required = min(5, target)
        if len(embeddings) < min_required:
            bad = ", ".join(failed_files[:5]) if failed_files else "unknown files"
            print(json.dumps({
                "ok": False,
                "error": f"Only {len(embeddings)} valid face samples found. Need at least {min_required}. Bad samples: {bad}"
            }))
            return

        db_file.parent.mkdir(parents=True, exist_ok=True)

        if db_file.exists():
            data = np.load(db_file, allow_pickle=True)
            old_names = list(data["names"])
            old_embs = list(data["embeddings"])
        else:
            old_names = []
            old_embs = []

        # remove old entries for same name
        names = []
        db_embs = []
        for old_name, old_emb in zip(old_names, old_embs):
            if str(old_name) != name:
                names.append(old_name)
                db_embs.append(old_emb)

        # save all valid embeddings
        for emb in embeddings:
            names.append(name)
            db_embs.append(emb)

        np.savez(
            db_file,
            names=np.array(names, dtype=object),
            embeddings=np.array(db_embs, dtype=object),
        )

        print(json.dumps({
            "ok": True,
            "message": f"Saved {name} with {len(embeddings)} valid templates.",
            "replaced_existing": True
        }))

    except Exception as e:
        print(json.dumps({
            "ok": False,
            "error": f"{type(e).__name__}: {str(e)}"
        }))


if __name__ == "__main__":
    main()