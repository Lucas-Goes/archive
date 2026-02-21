type Props = {
  title: string;
  username: string;
  status: string;
  type: string;
  rating?: number;
  line1: string;
  line2: string;
  formatType: (type: string) => string;
    font: {
    cssVar: string;
  };
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

export function LightTheme({
  title,
  username,
  type,
  rating,
  line1,
  line2,
  font,
}: Props) {
  return (
    <div
      id="share-card"
      className="w-[360px] h-[640px] rounded-3xl relative overflow-hidden"
      style={{
        color: "#111",
        border: "1px solid rgba(0,0,0,0.08)",
        fontFamily: font.cssVar,
      }}
    >
      {/* BACKGROUND IMAGE */}
      <img
        src="https://archive-me.com/themes/light/light-bg2.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-160 translate-x-[-20px] translate-y-[110px]"
      />

      {/* OVERLAY pra leitura */}
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.05) 100%)",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col h-full justify-between px-2">

        {/* HEADER */}
        <div className="uppercase font-extrabold tracking-tight leading-[0.9] pt-2">
          <div className="text-[52px] text-black/50">
            {line1}
          </div>

          <div className="text-[62px] text-black">
            {line2}
          </div>
        </div>

        {/* CENTER */}
        <div className="mt-6">

          <div
            className="w-full rounded-sm"
            style={{
              backgroundColor: "rgba(0,0,0,0.08)",
              backdropFilter: "blur(6px)",
            }}
          >
            <h2 className="text-[62px] font-bold leading-none tracking-tight text-left max-w-[80%]">
              {title}
            </h2>
          </div>

          <p
            className="text-[12px] font-bold text-xs text-right mt-1"
            style={{
              color: "rgba(0, 0, 0, 0.64)",
              fontStyle: "italic",
            }}
          >
            e registrei isso no meu archive
          </p>

        </div>

        {/* BOTTOM */}
        <div className="space-y-4 px-2">

          <div className="flex justify-between text-sm font-bold text-black/60">
            
            <span>Categoria: {formatType(type)}</span>

            {typeof rating === "number" && rating > 0 && (    
            <span className="flex items-center gap-1">
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

          {/* FOOTER */}
          <div className="relative mt-4">

            <div
              className="text-[12px] font-bold absolute inset-0 rounded-md"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent)",
                opacity: 0.2,
              }}
            />

            <div
              className="text-[12px] font-bold relative text-center text-xs py-3"
              style={{
                color: "rgba(0, 0, 0, 0.64)",
                borderTop: "1px solid rgba(0,0,0,0.1)",
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
