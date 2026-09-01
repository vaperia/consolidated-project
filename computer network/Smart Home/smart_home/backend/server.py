from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.system import router as system_router
from routes.sensors import router as sensors_router
from routes.windows import router as windows_router
from routes.light import router as light_router
from routes.fan import router as fan_router
from routes.door import router as door_router
from routes.notifications import router as notifications_router
from automation import start_automation_thread

app = FastAPI(title="Smart Home Dashboard Backend", version="1.0")

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

app.include_router(system_router)
app.include_router(sensors_router)
app.include_router(windows_router)
app.include_router(light_router)
app.include_router(fan_router)
app.include_router(door_router)
app.include_router(notifications_router)


@app.on_event("startup")
def startup_event():
    print("[STARTUP] Starting automation thread...")
    start_automation_thread()