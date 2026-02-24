"use client";

import { useRef, useEffect, useState } from "react";
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

export function ShareModal({
  open,
  onClose,
  title,
  username,
  status,
  type,
  rating,
}: Props) {
  const [isExporting, setIsExporting] = useState(false);

  const themeList = Object.keys(themes) as ThemeName[];
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = themeList[themeIndex];

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // -------------------------
  // TRAVAR SCROLL
  // -------------------------
  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    return () => {
      const y = document.body.style.top;

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";

      window.scrollTo(0, parseInt(y || "0") * -1);
    };
  }, [open]);

  // -------------------------
  // FECHAR COM ESC
  // -------------------------
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKey);
    }

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

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
        } catch {
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
      onMouseDown={onClose} // 👈 FECHA AO CLICAR FORA
    >
      <div
        className="scale-[0.75] origin-center"
        onMouseDown={(e) => e.stopPropagation()} // 👈 IMPEDE FECHAR DENTRO
      >
        {/* CONTAINER DO CARD */}
        <div className="w-full">
          
          {/* CARD */}
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="w-full">
                <ShareCard
                  title={title}
                  username={username}
                  status={status}
                  type={type}
                  rating={rating}
                  theme={theme}
                />
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="w-full mt-15">
            {/* CONTROLES */}
            <div
              className="
                absolute
                bottom-3
                left-1/2
                -translate-x-1/2
                w-[85%]
                flex items-center
                justify-between
                gap-1
                z-20
              "
            >
              {/* LEFT */}
              <button
                onClick={() =>
                  setThemeIndex((prev) =>
                    prev === 0 ? themeList.length - 1 : prev - 1
                  )
                }
                className="
                  w-9 h-9
                  rounded-full
                  flex items-center justify-center
                  backdrop-blur-xl
                  transition
                  hover:opacity-70
                "
                style={{
                  background: "var(--footer-bg)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                ←
              </button>

              {/* SHARE */}
              <button
                onClick={handleShare}
                disabled={isExporting}
                className="
                  flex-1
                  mx-2
                  py-2
                  rounded-xl
                  backdrop-blur-xl
                  text-sm
                  transition
                  disabled:opacity-50
                  hover:opacity-70
                "
                style={{
                  background: "var(--footer-bg)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                {isExporting ? "Gerando..." : "Compartilhar"}
              </button>

              {/* RIGHT */}
              <button
                onClick={() =>
                  setThemeIndex((prev) =>
                    prev === themeList.length - 1 ? 0 : prev + 1
                  )
                }
                className="
                  w-9 h-9
                  rounded-full
                  flex items-center justify-center
                  backdrop-blur-xl
                  transition
                  hover:opacity-70
                "
                style={{
                  background: "var(--footer-bg)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}