# db.py
from pathlib import Path
import numpy as np


def load_db(db_path: str):
    p = Path(db_path)
    if p.exists():
        data = np.load(p, allow_pickle=True)
        return {"names": list(data["names"]), "embeddings": list(data["embeddings"])}
    return {"names": [], "embeddings": []}


def save_db(db_path: str, db: dict):
    p = Path(db_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    np.savez(
        p,
        names=np.array(db["names"], dtype=object),
        embeddings=np.array(db["embeddings"], dtype=object),
    )


def add_templates(db: dict, name: str, embeddings: list):
    for emb in embeddings:
        db["names"].append(name)
        db["embeddings"].append(emb)