"use client";

import { useState,useEffect  } from "react";
import { createWork } from "@/app/actions/work";
import { useRouter } from "next/navigation";
import { StarRating } from "@/components/ui/StarRating";


export function CreateWorkModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [rating, setRating] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
  function handleEsc(e: KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  if (open) {
    document.addEventListener("keydown", handleEsc);
  }

  return () => {
    document.removeEventListener("keydown", handleEsc);
  };
  }, [open]);

  async function handleSubmit(formData: FormData) {
    if (status !== "idle") return;
  
    // 1. mostra loading IMEDIATO
    setStatus("loading");
  
    // adiciona rating
    if (rating !== null) {
      formData.set("rating", rating.toString());
    }
  
    // 2. inicia request
    const request = createWork(formData);
  
    // 3. garante loading visível
    await new Promise((r) => setTimeout(r, 1000));
  
    // 4. espera request terminar
    await request;
  
    // 5. mostra sucesso
    setStatus("success");
  
    // 6. segura sucesso na tela
    await new Promise((r) => setTimeout(r, 1900));
  
    // 7. fecha modal PRIMEIRO
    setOpen(false);
  
    // 8. reset estado
    setStatus("idle");
    setRating(null);
  
    // 9. só agora atualiza a tela
    router.refresh();
  }

  return (
    <>
      {/* BOTÃO + */}
      <button
        onClick={() => setOpen(true)}
        className="
          fixed top-25 right-3.5 z-50
          w-10 h-10
          rounded-full
          text-lg
          shadow-md
          flex items-center justify-center
          transition
          hover:scale-105
        "
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        }}
      >
        +
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* CONTENT */}
            <div
            className="relative z-10 w-full max-w-md p-6 rounded-2xl shadow-xl transition"
            style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                filter: status === "loading" ? "blur(4px)" : "none",
                opacity: status === "loading" ? 0.6 : 1,
            }}
            >

            {status !== "idle" && (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/10 backdrop-blur-sm">

                    <div
                    className="flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300"
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        backdropFilter: "blur(10px)",
                    }}
                    >
                    {status === "loading" ? (
                        <>
                        <span className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Adicionando...</span>
                        </>
                    ) : (
                        <>
                        <span className="text-2xl">✔</span>
                        <span>Adicionado com sucesso</span>
                        </>
                    )}
                    </div>

                </div>
            )}     

            <h2 className="text-sm font-medium opacity-70 mb-4">
              Nova obra
            </h2>

            <form action={handleSubmit} className="space-y-4">

              {/* TÍTULO */}
              <input
                name="title"
                placeholder="Título"
                required
                className="w-full p-3 rounded-lg border outline-none bg-transparent"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              />

              {/* TYPE */}
              <select
                name="type"
                className="w-full p-3 pr-10 rounded-lg border outline-none appearance-none"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  backgroundColor: "var(--card-bg)",
                }}
              >
                <option value="movie">Filme</option>
                <option value="series">Série</option>
                <option value="book">Livro</option>
                <option value="game">Jogo</option>
                <option value="anime">Anime</option>
                <option value="manga">Mangá</option>
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
                className="w-full p-3 pr-10 rounded-lg border outline-none appearance-none"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
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

              <div
                className="flex items-center justify-center p-2 rounded-lg border"
                style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--card-bg)",
                }}
                >
                <span className="text-sm" style={{ color: "var(--muted)" }}>
                    
                </span>

                <StarRating value={rating} onChange={setRating} />
                </div>

              {/* BOTÃO */}
               <button
                    type="submit"
                    disabled={status === "loading"}
                    className="
                        w-full p-3 rounded-lg
                        font-semibold
                        transition
                        flex items-center justify-center gap-2
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                        backdrop-blur-md
                    "
                    style={{
                        backgroundColor: "var(--footer-bg)",
                        color: "var(--text)",
                        border: "1px solid var(--border)",
                    }}
                    >
                    {status === "loading" ? (
                    <>
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Adicionando...
                    </>
                    ) : status === "success" ? (
                    "Adicionado ✓"
                    ) : (
                    "Adicionar ao Archive"
                    )}
                </button>

            </form>
          </div>
        </div>
      )}
    </>
  );
}