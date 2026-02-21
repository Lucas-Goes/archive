"use client";

import { useState,useEffect  } from "react";
import { updateWork } from "@/app/actions/work";
import { useRouter } from "next/navigation";
import { StarRating } from "@/components/ui/StarRating";
import { Work } from "@/types/work";

interface EditWorkModalProps {
  work: Work;
  open: boolean;
  onClose: () => void;
}

export function EditWorkModal({ work, open, onClose, }: EditWorkModalProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<number | null>(work.rating ?? null);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  if (!open) return null;

  async function handleSubmit(formData: FormData) {
    if (loading) return;

    setLoading(true);

    formData.set("id", work.id);

    if (rating !== null) {
      formData.set("rating", rating.toString());
    }

    await updateWork(formData);

    setLoading(false);
    onClose();
    router.refresh();    
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* CONTENT */}
      <div
        className="relative z-10 w-full max-w-md p-6 rounded-2xl shadow-xl"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        }}
      >
        <h2 className="text-lg font-semibold mb-4">
          Editar obra
        </h2>

        <form action={handleSubmit} className="space-y-4">

          {/* TÍTULO */}
          <input
            name="title"
            defaultValue={work.title}
            required
            className="w-full p-3 rounded-lg border bg-transparent"
            style={{ borderColor: "var(--border)" }}
          />

          {/* TYPE */}
          <select
            name="type"
            defaultValue={work.type}
            className="w-full p-3 pr-10 rounded-lg border outline-none appearance-none"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--card-bg)",
            }}
          >
            <option value="movie">Filme</option>
            <option value="series">Série</option>
            <option value="book">Livro</option>
            <option value="game">Jogo</option>
            <option value="anime">Anime</option>
            <option value="manga">Mangá</option>
            <option value="hq">HQ</option>
          </select>

          {/* SETA CUSTOM */}
          <div
            className="
              pointer-events-none
              absolute right-12 top-40 -translate-y-1/2
              text-xs
            "
            style={{ color: "var(--muted)" }}
          >
            ▼
          </div>  

          {/* STATUS */}
          <select
            name="status"
            defaultValue={work.status}
            className="w-full p-3 pr-10 rounded-lg border outline-none appearance-none"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--card-bg)",
            }}
          >
            <option value="want">Quero começar</option>
            <option value="in_progress">Em andamento</option>
            <option value="finished">Finalizado</option>
          </select>

            {/* SETA CUSTOM */}
            <div
              className="
                pointer-events-none
                absolute right-12 top-56 -translate-y-1/2
                text-xs
              "
              style={{ color: "var(--muted)" }}
            >
              ▼
            </div>  

          {/* RATING */}
          <div
            className="flex items-center justify-between p-3 rounded-lg border"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--card-bg)",
            }}
          >
            <span style={{ color: "var(--muted)" }}>
              Nota
            </span>

            <StarRating value={rating} onChange={setRating} />
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-lg font-semibold"
            style={{
              backgroundColor: "var(--footer-bg)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>

        </form>
      </div>
    </div>
  );
}