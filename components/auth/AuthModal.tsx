"use client";

import { useEffect, ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function AuthModal({ open, onClose, children }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    if (open) {
      window.addEventListener("keydown", onKey);
    }

    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xl transition-opacity"
      />

      {/* MODAL */}
      <div
        className="
          relative w-full max-w-sm p-8 rounded-3xl
          border border-white/10
          bg-white/5 backdrop-blur-xl
          shadow-[0_20px_80px_rgba(0,0,0,0.6)]
          animate-modal
        "
      >
        {children}
      </div>

    </div>
  );
}
