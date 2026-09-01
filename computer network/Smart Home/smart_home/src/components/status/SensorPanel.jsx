import Card from "../ui/Card";
import { getSoilStatus } from "../../utils/sensor";

export default function SensorPanel({ pi }) {
  const { temp, soil, motion, sensorStatus, rainRaw } = pi;

  return (
    <Card title="Temperature">
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-pink-500/30 via-purple-500/25 to-cyan-400/20 p-4 backdrop-blur-xl shadow-[0_0_70px_rgba(168,85,247,0.25)]">
          <div className="text-xs text-white/80">🌡 Temperature</div>
          <div className="mt-2 text-5xl font-black">
            {temp === null ? "Checking..." : `${temp.toFixed(1)}°C`}
          </div>
          <div className="mt-2 text-xs text-white/70">Sensor status: {sensorStatus}</div>
        </div>

        <div className="rounded-2xl border border-white/20 bg-black/25 p-4 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="text-xs text-white/80">🌧 Rain / Soil Sensor</div>
          <div className="mt-2 text-3xl font-black">{soil === null ? "Checking..." : soil}</div>
          <div className="mt-2 text-sm text-white/70">Status: {getSoilStatus(soil)}</div>
          {rainRaw !== null && <div className="mt-2 text-xs text-white/50">Raw: {rainRaw}</div>}
        </div>

        <div className="rounded-2xl border border-white/20 bg-black/25 p-4 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="text-xs text-white/80">🚶 Motion</div>
          <div className="mt-2 text-2xl font-black">{motion ? "Detected" : "No Motion"}</div>
        </div>
      </div>
    </Card>
  );
}