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
  const isReading = type === "book" || type === "hq" || type === "manga";

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

  const themeList = Object.keys(themes) as ThemeName[];
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = themeList[themeIndex];

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  if (!open) return null;

  // -------------------------
  // SHARE
  // -------------------------
  async function handleShare() {
    if (isExporting) return;

    setIsExporting(true);

    try {
      const url = `${window.location.origin}/api/share-image?title=${encodeURIComponent(
        title
      )}&username=${encodeURIComponent(
        username
      )}&status=${status}&type=${type}&rating=${rating ?? "0"}&theme=${theme}`;

      const response = await fetch(url);

      if (!response.ok) {
        const text = await response.text();
        alert(text);
        return;
      }

      const blob = await response.blob();

      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);

      const safeTitle = title
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "-")
        .replace(/-+/g, "-");

      const fileName = `archive_from_${username}-${safeTitle}.png`;

      if (isMobile && navigator.share) {
        try {
          const file = new File([blob], fileName, {
            type: "image/png",
          });

          await navigator.share({
            files: [file],
            title: fileName,
          });

          return;
        } catch (e) {
          console.log("share cancelado");
        }
      }

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar imagem");
    } finally {
      setIsExporting(false);
    }
  }

  // -------------------------
  // SWIPE
  // -------------------------
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    touchEndX.current = e.changedTouches[0].clientX;

    const delta = touchStartX.current - touchEndX.current;

    if (delta > 50) {
      setThemeIndex((prev) =>
        prev === themeList.length - 1 ? 0 : prev + 1
      );
    }

    if (delta < -50) {
      setThemeIndex((prev) =>
        prev === 0 ? themeList.length - 1 : prev - 1
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(16px)",
      }}
      onClick={onClose}
    >


      {/* CONTENT */}
      <div
        className="flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WRAPPER ÚNICO */}
        <div className="flex flex-col items-center gap-4">

          {/* CARD */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
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
          </div>

          {/* CONTROLS */}
          <div className="relative w-full flex items-center">

            {/* LEFT */}
            <button
              onClick={() =>
                setThemeIndex((prev) =>
                  prev === 0 ? themeList.length - 1 : prev - 1
                )
              }
              className="
                z-10
                w-10 h-10
                rounded-full
                flex items-center justify-center
                bg-white/10 backdrop-blur-md
                text-white
                transition
                hover:bg-white/20
              "
            >
              ←
            </button>

            {/* CENTER */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={handleShare}
                disabled={isExporting}
                className="
                  pointer-events-auto
                  px-20 py-2.5
                  rounded-xl
                  border border-white/10
                  bg-white/5
                  text-sm
                  backdrop-blur-md
                  transition
                  hover:bg-white/10
                  disabled:opacity-50
                "
              >
                {isExporting ? "Gerando..." : "Compartilhar"}
              </button>
            </div>

            {/* RIGHT */}
            <button
              onClick={() =>
                setThemeIndex((prev) =>
                  prev === themeList.length - 1 ? 0 : prev + 1
                )
              }
              className="
                ml-auto z-10
                w-10 h-10
                rounded-full
                flex items-center justify-center
                bg-white/10 backdrop-blur-md
                text-white
                transition
                hover:bg-white/20
              "
            >
              →
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}