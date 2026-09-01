import { cls } from "../../utils/classNames";

export default function VoiceAssistantCard({
  voiceListening,
  stopVoiceListening,
  startVoiceListening,
  voiceSupported,
  voiceStatus,
  lastHeard,
}) {
  return (
    <div className="mt-4 rounded-2xl border border-white/20 bg-black/25 p-4 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold">🎤 Ask Homie</div>
          <div className="mt-1 text-xs text-white/70">Push to talk smart-home assistant</div>
        </div>

        <button
          onClick={voiceListening ? stopVoiceListening : startVoiceListening}
          disabled={!voiceSupported}
          className={cls(
            "rounded-xl px-4 py-2 text-sm font-extrabold transition border",
            voiceListening
              ? "border-rose-200/30 bg-rose-500/25 text-rose-100 shadow-[0_0_30px_rgba(244,63,94,0.35)]"
              : "border-purple-200/30 bg-purple-500/25 text-white shadow-[0_0_30px_rgba(168,85,247,0.35)]",
            !voiceSupported && "opacity-50 cursor-not-allowed"
          )}
        >
          {voiceListening ? "Stop" : "Ask Homie"}
        </button>
      </div>

      <div className="mt-3 text-sm text-white/80">Status: {voiceStatus}</div>
      <div className="mt-2 text-xs text-white/70">Last heard: {lastHeard || "-"}</div>
      <div className="mt-3 text-xs text-white/60">
        Try: “hey homie, what’s the temperature?”
      </div>
    </div>
  );
}