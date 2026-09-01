import Card from "../ui/Card";
import Pill from "../ui/Pill";
import RegisterFaceCard from "./RegisterFaceCard";

export default function EntranceCamera({ camApi, cam }) {
  const {
    camConnected,
    camStatus,
    camEvents,
    regName,
    setRegName,
    regBusy,
    regActive,
    regCaptured,
    regTarget,
    regReadyToFinish,
    regStart,
    regCapture,
    regFinish,
    regStatus,
    regError,
    setCamConnected,
  } = cam;

  const lastEvent = camEvents?.[0];

  return (
    <Card
      title="Entrance Camera — Ring Module"
      right={
        <div className="text-xs text-white/80">
          CAM: <span className="font-mono text-white">{camApi}</span>
        </div>
      }
    >
      <div className="rounded-2xl border border-white/20 bg-black/25 p-4 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-black">📹 {camStatus?.camera_name || "Front Door"}</div>
            <div className="mt-1 text-sm text-white/80">
              {camConnected ? "Live stream + AI detection" : "Camera service offline"}
            </div>
          </div>
          <Pill tone={camConnected ? "good" : "bad"}>{camConnected ? "LIVE" : "OFFLINE"}</Pill>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/20">
          <img
            src={`${camApi}/stream`}
            className="w-full"
            alt="Entrance camera stream"
            onError={() => setCamConnected(false)}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/20 bg-black/30 p-3">
            <div className="text-xs text-white/70">Faces</div>
            <div className="text-2xl font-black">{camStatus?.faces ?? "--"}</div>
          </div>
          <div className="rounded-xl border border-white/20 bg-black/30 p-3">
            <div className="text-xs text-white/70">Unknown</div>
            <div
              className={`text-2xl font-black ${(camStatus?.unknown_count ?? 0) > 0 ? "text-rose-200" : ""}`}
            >
              {camStatus?.unknown_count ?? "--"}
            </div>
          </div>
          <div className="rounded-xl border border-white/20 bg-black/30 p-3">
            <div className="text-xs text-white/70">Parcels</div>
            <div className="text-2xl font-black">{camStatus?.parcels ?? "--"}</div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/20 bg-black/30 p-4">
          <div className="text-sm font-extrabold">Last Detection</div>
          <div className="mt-2 text-sm text-white/80">
            {lastEvent ? (
              <>
                <div className="font-mono text-xs text-white/70">{lastEvent.ts}</div>
                <div className="mt-1">
                  <span className="font-extrabold">{lastEvent.type}</span>
                  {lastEvent.num_unknown != null && (
                    <span className="text-white/70"> • unknown: {lastEvent.num_unknown}</span>
                  )}
                  {lastEvent.count != null && (
                    <span className="text-white/70"> • count: {lastEvent.count}</span>
                  )}
                </div>
              </>
            ) : (
              "No events yet."
            )}
          </div>
        </div>

        <RegisterFaceCard
          regName={regName}
          setRegName={setRegName}
          regBusy={regBusy}
          regActive={regActive}
          regReadyToFinish={regReadyToFinish}
          regStart={regStart}
          regCapture={regCapture}
          regFinish={regFinish}
          regStatus={regStatus}
          regCaptured={regCaptured}
          regTarget={regTarget}
          regError={regError}
        />

        <div className="mt-3 text-xs text-white/70">
          This uses MJPEG stream + JSON polling (stable and demo-friendly).
        </div>
      </div>
    </Card>
  );
}