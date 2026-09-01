export default function TogglePair({
  leftLabel,
  rightLabel,
  isLeftActive,
  onLeft,
  onRight,
  disabled,
}) {
  const base =
    "rounded-xl px-4 py-2 text-sm font-extrabold transition active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed";

  const active =
    "bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 text-white " +
    "shadow-[0_0_45px_rgba(236,72,153,0.5)] border border-white/20";

  const inactive = "bg-black/30 border border-white/25 text-white/90 hover:bg-white/10";

  return (
    <div className="flex gap-2">
      <button disabled={disabled} onClick={onLeft} className={`${base} ${isLeftActive ? active : inactive}`}>
        {leftLabel}
      </button>
      <button disabled={disabled} onClick={onRight} className={`${base} ${!isLeftActive ? active : inactive}`}>
        {rightLabel}
      </button>
    </div>
  );
}