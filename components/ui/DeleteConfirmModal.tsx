"use client";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="relative z-10 w-full max-w-sm p-6 rounded-2xl shadow-xl"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="space-y-4 text-center">
          <p style={{ color: "var(--muted)" }}>
            Remover item do Archive?
          </p>

          <div className="flex gap-3 pt-4">
            
            <button
              onClick={onClose}
              className="flex-1 p-2 rounded-lg border"
              style={{
                borderColor: "var(--border)",
              }}
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 p-2 rounded-lg"
              style={{
                backgroundColor: "#ef4444",
                color: "white",
              }}
            >
              Remover
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}