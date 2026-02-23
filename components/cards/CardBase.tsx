"use client";

import { Work } from "@/types/work";

type Props = {
  work: Work;
  showActions?: boolean;
  onMenuClick?: () => void;
};

export function CardBase({ work, showActions, onMenuClick }: Props) {
  function getOverlayIndex(id: string) {
    let hash = 0;

    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    return Math.abs(hash);
  }

  const overlayIndex = getOverlayIndex(work.id) % 5;
  const overlayClass = `work-card-overlay overlay-${overlayIndex + 1}`;

  return (
    <div className="work-card relative w-full aspect-[2/3] rounded-2xl overflow-hidden">

      <div className="absolute inset-0 bg-white/5" />        

      {/* BG */}
      <div className="absolute inset-0 work-card-bg z-0" />
      <div className={`absolute inset-0 ${overlayClass} z-0`} />

      {/* MENU BUTTON */}
      {showActions && (
      <button
          onClick={(e) => {
          e.stopPropagation();
          onMenuClick?.();
          }}
            className="
            absolute top-8 right-8 z-20
            w-8 h-8
            flex items-center justify-center
            rounded-full
            backdrop-blur-md
            border border-gray-400
            text-sm
            "
      >
          ⋯
      </button>
      )}

      {/* CONTENT */}
      <div className="relative z-10 p-4 h-full flex flex-col justify-between">

        <div className="max-w-[70%]">
          <h2 className="card-title">{work.title}</h2>
          <div className="card-type">
            {formatType(work.type)}
          </div>
        </div>

        <div>
          <span className="card-muted">
            {"★".repeat(work.rating ?? 0)}
          </span>

          <div className="card-muted">
            {formatStatus(work.status, work.type)}
          </div>
        </div>

      </div>
    </div>
  );
}

/* helpers */
function formatStatus(status: string, type: string) {
  const isGame = type === "game";
  const isReading = type === "book" || type === "hq" || type === "manga";

  switch (status) {
    case "want":
      if (isGame) return "Quero jogar";
      if (isReading) return "Quero ler";
      return "Quero ver";
    case "in_progress":
      if (isGame) return "Jogando";
      if (isReading) return "Lendo";
      return "Assistindo";
    case "finished":
      return "Finalizado";
    default:
      return status;
  }
}

function formatType(type: string) {
  switch (type) {
    case "movie": return "Filme";
    case "series": return "Série";
    case "game": return "Jogo";
    case "book": return "Livro";
    case "anime": return "Anime";
    case "manga": return "Mangá";
    case "hq": return "HQ";
    default: return type;
  }
}