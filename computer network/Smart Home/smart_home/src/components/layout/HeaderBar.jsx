import Pill from "../ui/Pill";

export default function HeaderBar({
  userName,
  connected,
  camConnected,
  timeLabel,
}) {
  return (
    <div className="flex justify-between items-center mb-6 gap-4">
      <div>
        <div className="text-sm text-white/80">Good evening</div>
        <div className="text-3xl font-black">{userName}</div>
      </div>

      <div className="flex gap-3 flex-wrap justify-end">
        <Pill tone={connected ? "good" : "bad"}>
          {connected ? "Pi Connected" : "Pi Offline"}
        </Pill>
        <Pill tone={camConnected ? "good" : "bad"}>
          {camConnected ? "Cam Online" : "Cam Offline"}
        </Pill>
        <Pill>{timeLabel}</Pill>
      </div>
    </div>
  );
}