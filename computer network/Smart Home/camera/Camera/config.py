# config.py

# ---------------------------
# Face recognition (DeepFace)
# ---------------------------
MODEL_NAME = "Facenet"        # 128-dim fast. If you change model, DELETE DB and re-register.
DETECTOR = "opencv"

RESIZE_WIDTH = 480            # 320-480; bigger detects smaller faces but slower
FACE_INFER_EVERY_SEC = 1.5

THRESHOLD = 0.23              # lower = stricter acceptance of known faces
MARGIN = 0.06                 # gap between best identity and next identity

REGISTER_SAMPLES = 8
UNKNOWN_COOLDOWN_SEC = 5

# Extra face filtering to reduce ghost detections
MIN_FACE_RATIO = 0.12         # detected face must be at least 12% of frame width/height
EDGE_MARGIN_RATIO = 0.02      # reject boxes hugging the frame edges
MIN_DETECT_CONFIDENCE = 0.80  # if detector supplies confidence, require at least this

# ---------------------------
# Tracking (for faces)
# ---------------------------
TRACK_MAX_MISSES = 18
TRACK_MIN_IOU = 0.12
TRACK_MAX_CENTER_DIST = 220.0
TRACK_SMOOTH = 0.70

# ---------------------------
# Parcel detection (YOLOv8)
# Note: COCO has no "parcel" class.
# We'll treat these as parcel-like for demo.
# ---------------------------
YOLO_MODEL = "yolov8n.pt"        # small and fast
PARCEL_CLASSES = {"backpack", "handbag", "suitcase"}  # parcel-like proxies
PARCEL_CONF = 0.35
PARCEL_IOU = 0.45
PARCEL_INFER_EVERY_SEC = 0.8
PARCEL_COOLDOWN_SEC = 12

# Only detect parcels near bottom part of the frame (doorstep area)
PARCEL_ROI_Y_START = 0.45        # bottom 55% of frame

# ---------------------------
# Unlock gating (next servo step)
# ---------------------------
UNLOCK_HOLD_SEC = 5.0
UNLOCK_COOLDOWN_SEC = 8.0

# ---------------------------
# UI
# ---------------------------
CAMERA_NAME = "Front Door"
SHOW_LIVE_DOT = True

# Focus zone (optional guide)
FOCUS_INNER_SIZE = 280
FOCUS_OUTER_SIZE = 560

# ---------------------------
# Paths
# ---------------------------
DB_FILE = "data/deepface_db.npz"
EVENT_LOG = "logs/events.jsonl"
