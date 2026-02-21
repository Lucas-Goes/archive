type Props = {
  title: string;
  username: string;
  status: string;
  type: string;
  rating?: number;
  line1: string;
  line2: string;
  formatType: (type: string) => string;
  renderStars: (rating: number) => string;
};

// -------------------------
function formatType(type: string) {
  switch (type) {
    case "movie":
      return "Filme";
    case "series":
      return "Série";
    case "game":
      return "Game";
    case "book":
      return "Livro";
    case "anime":
      return "Anime";
    case "manga":
      return "Mangá";
    default:
      return type;
  }
}

function renderStars(rating: number) {
  return "★★★★★".slice(0, rating);
}

function getHeadlineParts(status: string, type: string) {
  const isGame = type === "game";
  const isReading = type === "book" || type === "manga";

  if (status === "want") {
    if (isGame) return ["Quero", "jogar"];
    if (isReading) return ["Quero", "ler"];
    return ["Quero", "assistir"];
  }

  if (status === "in_progress") {
    if (isGame) return ["Estou", "jogando"];
    if (isReading) return ["Estou", "lendo"];
    return ["Estou", "assistindo"];
  }

  if (status === "finished") {
    if (isGame) return ["Acabei de", "finalizar"];
    if (isReading) return ["Acabei de", "ler"];
    return ["Acabei de", "ver"];
  }

  return ["", ""];
}

export function DarkTheme({
  title,
  username,
  status,
  type,
  rating,
}: Props) {
  const [line1, line2] = getHeadlineParts(status, type);

  return (
    <div
      id="share-card"
      className="w-[360px] h-[640px] rounded-3xl relative overflow-hidden"
      style={{
        backgroundColor: "#0b0b0b",
        color: "#ffffff",
        border: "1px solid rgba(255,255,255,0.05)",
        fontFamily: "var(--font-lexend)",
      }}
    >
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15), transparent 60%)",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col h-full justify-between px-1">

        {/* HEADER */}
        <div className="uppercase font-extrabold tracking-tight leading-[0.9] pr-2 pl-2 pt-2 pb-0">
          <div
            className="text-[52px]"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {line1}
          </div>

          <div className="text-[62px]">
            {line2}
          </div>
        </div>

        {/* CENTER */}
        <div className="mt-6 space-y-0">

          <div
            className="w-full rounded-sm backdrop-blur-sm"
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          >
            <h2 className="text-[62px] text-left font-bold leading-none tracking-tight max-w-[80%]">
              {title}
            </h2>
          </div>

          <p className="text-xs text-right" style={{ 
            fontFamily: 'sans-serif', 
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.05em'
            }}>
            e guardei isso no meu archive
        </p>

        </div>

        {/* BOTTOM */}
        <div className="space-y-4 px-2">

          <div
            className="flex justify-between text-sm font-bold"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <span>Categoria: {formatType(type)}</span>

            {rating !== undefined && rating !== null && (
            <span className="flex items-center gap-1 font-bold">
              Nota
              <span className="flex items-center gap-[2px] ">
                {Array.from({ length: typeof rating === "number" ? rating : 0 }).map((_, i) => (
                  <svg
                    key={i}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
                  </svg>
                ))}
              </span>
            </span>
            )}
          </div>

          <div className="relative mt-4">
            <div
              className="absolute inset-0 rounded-md"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)",
                opacity: 0.2,
              }}
            />

            <div
              className="text-[15px] relative text-center text-xs py-3 backdrop-blur-sm"
              style={{
                color: "rgba(255,255,255,0.4)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              archive-me.app/{username}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
