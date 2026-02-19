"use client";

interface CardMenuProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CardMenu({
  open,
  onClose,
  onEdit,
  onDelete,
}: CardMenuProps) {
  if (!open) return null;

  return (
    <div
      className="
        absolute inset-0 z-30
        flex flex-col justify-center items-center
        rounded-xl
        transition
      "
      style={{
        backgroundColor: "var(--card-bg)",
        backdropFilter: "blur(8px)",
        border: "1px solid var(--border)",
      }}
      onClick={onClose} // clique fora fecha
    >
      <div
        className="flex flex-col gap-3 w-full px-6"
        onClick={(e) => e.stopPropagation()} // evita fechar ao clicar nas opções
      >
        <button
          onClick={onEdit}
          className="
            w-full p-3 rounded-lg text-sm font-medium
            transition
            hover:bg-[var(--border)]
          "
        >
          Editar
        </button>

        <button
          onClick={onDelete}
          className="
            w-full p-3 rounded-lg text-sm font-medium
            transition
            hover:bg-red-500/10
          "
          style={{ color: "#ef4444" }}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}