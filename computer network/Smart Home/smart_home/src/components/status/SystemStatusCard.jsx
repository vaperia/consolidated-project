import Card from "../ui/Card";

export default function SystemStatusCard({ connected, camConnected, busy }) {
  return (
    <Card title="System Status">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/80">Backend</span>
          <span className={connected ? "text-emerald-200 font-extrabold" : "text-rose-200 font-extrabold"}>
            {connected ? "Online" : "Offline"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/80">Camera Service</span>
          <span className={camConnected ? "text-emerald-200 font-extrabold" : "text-rose-200 font-extrabold"}>
            {camConnected ? "Online" : "Offline"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/80">Controls Busy</span>
          <span className="font-extrabold">{busy ? "Yes" : "No"}</span>
        </div>

        <div className="mt-3 text-xs text-white/70">
          If Cam Offline: ensure <span className="font-mono">uvicorn server:app --port 5001</span> is running.
        </div>
      </div>
    </Card>
  );
}