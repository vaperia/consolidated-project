import { cls } from "../../utils/classNames";

export default function NavTile({ title, subtitle, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cls(
        "w-full rounded-2xl border p-4 text-left transition backdrop-blur-xl",
        active
          ? "border-purple-200/30 bg-purple-500/25 shadow-[0_0_50px_rgba(168,85,247,0.25)]"
          : "border-white/20 bg-black/30 hover:bg-white/10"
      )}
    >
      <div className="text-sm font-extrabold text-white">{title}</div>
      <div className="mt-1 text-xs text-white/70">{subtitle}</div>
    </button>
  );
}