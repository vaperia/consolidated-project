import { cls } from "../../utils/classNames";

export default function Pill({ children, tone = "neutral" }) {
  const toneClass =
    tone === "good"
      ? "border-emerald-200/30 bg-emerald-400/25 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.35)]"
      : tone === "bad"
      ? "border-rose-200/30 bg-rose-500/25 text-rose-100 shadow-[0_0_30px_rgba(244,63,94,0.35)]"
      : "border-white/20 bg-white/15 text-white";

  return (
    <div className={cls("rounded-full border px-4 py-2 text-sm font-bold", toneClass)}>
      {children}
    </div>
  );
}