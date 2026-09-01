export default function Card({ title, right, children }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-black/40 backdrop-blur-xl p-4 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm font-extrabold text-white">{title}</div>
        {right}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}