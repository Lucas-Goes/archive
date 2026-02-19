"use client";

import { themes, ThemeName } from "./themes";

type Props = {
  title: string;
  username: string;
  status: string;
  type: string;
  rating?: number;
  theme?: ThemeName;
};

// -------------------------
// HELPERS
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
  return "★".repeat(rating);
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

// -------------------------
// COMPONENT
// -------------------------

export function ShareCard({
  title,
  username,
  status,
  type,
  rating,
  theme,
}: Props) {

  // 🔥 1. CALCULAR TEXTO
  const [line1, line2] = getHeadlineParts(status, type);

  // 🔥 2. ESCOLHER TEMA
  const ThemeComponent = themes[theme || "dark"];

  // 🔥 3. RENDERIZAR TEMA
  return (
    <ThemeComponent
      title={title}
      username={username}
      status={status}
      type={type}
      rating={rating}
      line1={line1}
      line2={line2}
      formatType={formatType}
      renderStars={renderStars}
    />
  );
}
