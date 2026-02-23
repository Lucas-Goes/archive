"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CardBase } from "@/components/cards/CardBase";
import { Work } from "@/types/work";

type Props = {
  open: boolean;
  onClose: () => void;
  work: Work;
  isOwner: boolean;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function SoftCard({
  open,
  onClose,
  work,
  isOwner,
  onShare,
  onEdit,
  onDelete,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  /* bloquear scroll */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* fechar menu ao clicar fora */
  useEffect(() => {
    function handleClick() {
      setMenuOpen(false);
    }

    if (menuOpen) {
      document.addEventListener("click", handleClick);
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [menuOpen]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* CENTER */}
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          >
            <div
              className="relative w-[85vw] max-w-[320px] mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CARD */}
              <CardBase
                work={work}
                showActions={isOwner}
                onMenuClick={() => {
                  if (!isOwner) return;
                  setMenuOpen((v) => !v);
                }}
              />

              {/* MENU */}
              {isOwner && menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="
                        absolute
                        bottom-full
                        left-0
                        mb-2
                        w-full
                        z-50
                        rounded-xl
                        border border-white/1
                        bg-black/900
                        shadow-xl
                        backdrop-blur-xl
                        overflow-hidden
                        flex items-center 
                        justify-center 
                        text-center
                        font-semibold
                  "

                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onShare();
                    }}
                    className="w-full px-4 py-3 text-sm hover:bg-white/5"
                  >
                    Compartilhar
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit();
                    }}
                    className="w-full px-4 py-3 text-sm hover:bg-white/5"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                    className="w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    Excluir
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}