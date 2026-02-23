"use client";

import { useTap } from "@/lib/useTap";

interface CardMenuProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CardMenu({ open, onClose, onEdit, onDelete }: CardMenuProps) {
  const tapHandlers = useTap(() => {
    onClose();
  });

  if (!open) return null;

  return (
    <div
      {...tapHandlers}
      className="absolute inset-0 z-30 flex flex-col justify-center items-center rounded-xl transition cursor-pointer"
      style={{
        backgroundColor: "var(--card-bg)",
        backdropFilter: "blur(8px)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="flex flex-col gap-3 w-full px-6"
        // Interrompe todos os eventos vindos do useTap do pai
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <button
          onClick={onEdit}
          className="w-full p-3 rounded-lg text-sm font-medium transition hover:bg-[var(--border)] bg-white/5"
        >
          Editar
        </button>

        <button
          onClick={onDelete}
          className="w-full p-3 rounded-lg text-sm font-medium transition hover:bg-red-500/10"
          style={{ color: "#ef4444" }}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
