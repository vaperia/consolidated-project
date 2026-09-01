export default function RegisterFaceCard({
  regName,
  setRegName,
  regBusy,
  regActive,
  regReadyToFinish,
  regStart,
  regCapture,
  regFinish,
  regStatus,
  regCaptured,
  regTarget,
  regError,
}) {
  return (
    <div className="mt-4 rounded-2xl border border-white/20 bg-black/30 p-4">
      <div className="text-sm font-extrabold">Register Face (Admin)</div>

      <div className="mt-2 flex gap-2">
        <input
          value={regName}
          onChange={(e) => setRegName(e.target.value)}
          placeholder="Name (e.g. Ryan)"
          disabled={regBusy || regActive}
          className="w-full rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none disabled:opacity-50"
        />
        <button
          disabled={regBusy || !regName.trim() || regActive}
          onClick={regStart}
          className="rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-sm font-extrabold hover:bg-white/10 disabled:opacity-50"
        >
          Start
        </button>
      </div>

      <div className="mt-3 flex gap-2 flex-wrap items-center">
        <button
          disabled={regBusy || !regActive || regReadyToFinish}
          onClick={regCapture}
          className="rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-sm font-extrabold hover:bg-white/10 disabled:opacity-50"
        >
          {regReadyToFinish ? "Samples Complete" : "Capture Sample"}
        </button>

        <button
          disabled={regBusy || !regReadyToFinish}
          onClick={regFinish}
          className="rounded-xl border border-white/20 bg-black/30 px-4 py-2 text-sm font-extrabold hover:bg-white/10 disabled:opacity-50"
        >
          Finish & Save
        </button>

        <div className="ml-auto text-xs text-white/70">
          {regActive
            ? regReadyToFinish
              ? `Ready to save: ${regStatus?.name} — ${regCaptured}/${regTarget}`
              : `Registering: ${regStatus?.name} — ${regCaptured}/${regTarget}`
            : "Idle"}
        </div>
      </div>

      {regError && <div className="mt-3 text-sm text-rose-200 font-bold">{regError}</div>}

      {regActive && !regReadyToFinish && (
        <div className="mt-2 text-xs text-white/70">
          Capture samples with slightly different angles until you reach {regTarget}/{regTarget}.
        </div>
      )}

      {regReadyToFinish && (
        <div className="mt-2 text-xs font-bold text-emerald-200">
          Enough samples collected. Click “Finish & Save”.
        </div>
      )}

      <div className="mt-2 text-xs text-white/70">
        Tip: keep only 1 face in frame and avoid pressing capture too quickly.
      </div>
    </div>
  );
}