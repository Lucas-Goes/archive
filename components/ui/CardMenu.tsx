"use client";

import { useTap } from "@/lib/useTap";

interface CardMenuProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CardMenu({ open, onClose, onEdit, onDelete }: CardMenuProps) {
  // Hook que detecta o "tap" para fechar o menu ao clicar fora das opções
  const tapHandlers = useTap(() => {
    onClose();
  });

  if (!open) return null;

  return (
    <div
      {...tapHandlers}
      /* Adicionei 'touch-none' para o scroll da página travar enquanto o menu estiver aberto */
      className="absolute inset-0 z-30 flex flex-col justify-center items-center rounded-xl transition cursor-pointer touch-none"
      style={{
        backgroundColor: "var(--card-bg)",
        backdropFilter: "blur(8px)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="flex flex-col gap-3 w-full px-6"
        /* Adicionei os 4 stopPropagation abaixo para que o toque nos botões não feche o menu */
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            onEdit(); 
          }}
          className="w-full p-3 rounded-lg text-sm font-medium transition hover:bg-[var(--border)] bg-white/5"
        >
          Editar
        </button>

        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            onDelete(); 
          }}
          className="w-full p-3 rounded-lg text-sm font-medium transition hover:bg-red-500/10"
          style={{ color: "#ef4444" }}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
