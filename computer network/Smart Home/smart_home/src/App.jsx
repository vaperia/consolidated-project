import { useMemo, useState } from "react";
import { USER_NAME, PI_API, CAM_API } from "./constants/config";
import { usePiApi } from "./hooks/usePiApi";
import { useCameraApi } from "./hooks/useCameraApi";
import { useVoiceControl } from "./hooks/useVoiceControl";

import HeaderBar from "./components/layout/HeaderBar";
import Sidebar from "./components/layout/Sidebar";
import RoomControls from "./components/room/RoomControls";
import EntranceCamera from "./components/entrance/EntranceCamera";
import SensorPanel from "./components/status/SensorPanel";
import SystemStatusCard from "./components/status/SystemStatusCard";

export default function App() {
  const [activePage, setActivePage] = useState("room");

  const pi = usePiApi();
  const cam = useCameraApi(activePage);
  const voice = useVoiceControl({
    temp: pi.temp,
    soil: pi.soil,
    motion: pi.motion,
    rainStatus: pi.rainStatus,
    act: pi.act,
  });

  const timeLabel = useMemo(
    () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    [pi.state, pi.temp, pi.soil, pi.motion, pi.connected, cam.camConnected, cam.camStatus, cam.regStatus]
  );

  return (
    <div className="min-h-screen rainbow-bg text-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <HeaderBar
          userName={USER_NAME}
          connected={pi.connected}
          camConnected={cam.camConnected}
          timeLabel={timeLabel}
        />

        <div className="grid lg:grid-cols-[280px_1fr_340px] gap-5">
          <Sidebar activePage={activePage} setActivePage={setActivePage} />

          <div className="space-y-4">
            {activePage === "room" ? (
              <RoomControls piApi={PI_API} pi={pi} voice={voice} />
            ) : (
              <EntranceCamera camApi={CAM_API} cam={cam} />
            )}
          </div>

          <div className="space-y-4">
            <SensorPanel pi={pi} />
            <SystemStatusCard
              connected={pi.connected}
              camConnected={cam.camConnected}
              busy={pi.busy}
            />
          </div>
        </div>
      </div>
    </div>
  );
}