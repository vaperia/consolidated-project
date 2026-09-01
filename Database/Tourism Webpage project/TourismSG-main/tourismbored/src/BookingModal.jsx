// src/BookingModal.jsx
import { useEffect } from "react";

export default function BookingModal({ open, onClose, title, children }) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-[min(640px,92vw)] rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-blue-800">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100" aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
