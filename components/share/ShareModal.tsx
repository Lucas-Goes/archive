"use client";

import { useRef, useState } from "react";
import { ShareCard } from "@/components/share/ShareCard";
import { themes, ThemeName } from "./themes";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  username: string;
  status: string;
  type: string;
  rating?: number;
};

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

export function ShareModal({
  open,
  onClose,
  title,
  username,
  status,
  type,
  rating,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [line1, line2] = getHeadlineParts(status, type);
  const themeList = Object.keys(themes) as ThemeName[];
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = themeList[themeIndex];

  if (!open) return null;

  // -------------------------
  // SHARE
  // -------------------------
    async function handleShare() {
      if (isExporting) return; // 🔥 evita clique duplo

      setIsExporting(true);

      try {
      const url = `${window.location.origin}/api/share-image?title=${encodeURIComponent(
        title
      )}&username=${encodeURIComponent(
        username
      )}&status=${status}&type=${type}&rating=${rating ?? ""}&theme=${theme}`;

        console.log("CLICK SHARE");
        console.log("URL:", url);
        const response = await fetch(url);
        console.log("RESPONSE:", response.status);

        if (!response.ok) {
          const text = await response.text();
          console.error("API ERROR:", text);
          alert("Erro ao gerar imagem");
          return;
        }

        const blob = await response.blob();

        const file = new File([blob], "archive.png", {
          type: "image/png",
        });

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Archive",
          });
        } else {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "archive.png";
          link.click();
        }

      } catch (err) {
        console.error(err);
        alert("Erro ao gerar imagem");
      } finally {
        setIsExporting(false); // 🔥 sempre libera no final
      }
    }
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative bg-[#0c0c0c] rounded-2xl p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >

    {/* LEFT ARROW */}
    <button
        onClick={() =>
            setThemeIndex((prev) =>
            prev === 0 ? themeList.length - 1 : prev - 1
            )
        }
        className="
            absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full -ml-3
            w-10 h-10 rounded-full
            flex items-center justify-center
            text-sm
            backdrop-blur-md
            transition
            hover:scale-110
        "
        style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
        }}
        >
        ←
        </button>

        {/* RIGHT ARROW */}
        <button
        onClick={() =>
            setThemeIndex((prev) =>
            prev === themeList.length - 1 ? 0 : prev + 1
            )
        }
        className="
            absolute right-0 top-1/2 -translate-y-1/2 translate-x-full -mr-3
            w-10 h-10 rounded-full
            flex items-center justify-center
            text-sm
            backdrop-blur-md
            transition
            hover:scale-110
        "
        style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
        }}
        >
        →
    </button>
        
    {/* Share CARD */}
    <AnimatePresence mode="wait">
        <motion.div
            key={theme} // 🔥 ESSENCIAL
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 0.99 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
        >
            <ShareCard
            title={title}
            username={username}
            status={status}
            type={type}
            rating={rating}
            theme={theme}
            />
        </motion.div>
    </AnimatePresence>

    {/* BOTÃO */}
      <button
        onClick={handleShare}
        disabled={isExporting}
        className="w-full py-3 rounded-lg border text-sm transition hover:bg-white/5 disabled:opacity-50"
      >
        {isExporting ? "Gerando..." : "Compartilhar"}
      </button>

      </div>
    </div>
  );
}
