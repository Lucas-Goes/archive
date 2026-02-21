import { Work } from "@/types/work";

interface ProfileStatsProps {
  works: Work[];
}

export function ProfileStats({ works }: ProfileStatsProps) {
  const total = works.length;

  // 🔥 agrupa automaticamente por tipo
  const countsByType = works.reduce((acc, work) => {
    acc[work.type] = (acc[work.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ordem fixa (opcional)
  const order = ["movie","series", "book", "game", "anime","manga", "hq"];

  return (
    <div className="flex justify-center mt-0">
      <div
        className="flex gap-6 px-6 py-4 text-sm mt-0 justify-center"
        style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        }}
      >
        <Stat label="Obras" value={total} />

        {order
          .filter((type) => countsByType[type])
          .map((type) => (
            <Stat
              key={type}
              label={formatType(type)}
              value={countsByType[type]}
            />
          ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex gap-1 items-baseline">
      <span className="font-semibold">{value}</span>
      <span style={{ color: "var(--muted)" }}>{label}</span>
    </div>
  );
}

// 🔥 tradução dos tipos
function formatType(type: string) {
  switch (type) {
    case "movie":
      return "Filmes";
    case "series":
      return "Série";      
    case "book":
      return "Livros";
    case "game":
      return "Jogos";
    case "anime":
      return "Animes";
    case "manga":
      return "Mangá";      
    case "hq":
      return "HQ";
    default:
      return type;
  }
}