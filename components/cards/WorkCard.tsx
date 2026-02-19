"use client";

/* =====================================================
  IMPORTS
===================================================== */
import { Work } from "@/types/work";
import { deleteWork } from "@/app/actions/work";
import { useRouter } from "next/navigation";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { CardMenu } from "@/components/ui/CardMenu";
import { useState, useEffect, useRef } from "react";
import { EditWorkModal } from "@/components/ui/EditWorkModal";
import { ShareModal } from "@/components/share/ShareModal";

/* =====================================================
  TYPES
===================================================== */
interface WorkCardProps {
  work: Work;
  isOwner: boolean;
  username: string;
}

/* =====================================================
  COMPONENT
===================================================== */
export function WorkCard({ work, isOwner, username }: WorkCardProps) {
  const router = useRouter();

  /* =========================
    STATE
  ========================= */
  const [openDelete, setOpenDelete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openShare, setOpenShare] = useState(false);

  /* =========================
    REFS
  ========================= */
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

  /* =========================
    LAYOUT
  ========================= */
  const sizes = [12, 18, 26, 16, 20];
  const span = sizes[work.id.charCodeAt(0) % sizes.length];

  function getOverlayIndex(id: string) {
    let hash = 0;

    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    return Math.abs(hash);
  }

  const overlayIndex = getOverlayIndex(work.id) % 5;
  const overlayClass = `work-card-overlay overlay-${overlayIndex + 1}`;


  /* =====================================================
    ACTIONS
  ===================================================== */

  async function handleDelete() {
    await deleteWork(work.id);
    setOpenDelete(false);
    setMenuOpen(false);
    router.refresh();
  }

  function handleEdit() {
    setOpenEdit(true);
    setMenuOpen(false);
  }

  function handleDeleteClick() {
    setMenuOpen(false);
    setOpenDelete(true);
  }

  function handleShare() {
    setOpenShare(true);
  }

  /* =====================================================
    MOBILE LONG PRESS
  ===================================================== */

  function handleTouchStart() {
    longPressTriggered.current = false;

    pressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setMenuOpen(true);
    }, 500);
  }

  function handleTouchEnd() {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }

    if (!longPressTriggered.current) {
      handleShare();
    }
  }

  /* =====================================================
    CLICK OUTSIDE
  ===================================================== */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  /* =====================================================
    ESC CLOSE
  ===================================================== */

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setOpenDelete(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* =====================================================
    RENDER
  ===================================================== */

  return (
    <>
      <div
        ref={menuRef}
        className="work-card-container"
        style={{ gridRow: `span ${span}` }}
      >
        {/* BACKGROUND */}
        <div className="work-card-bg" />

        {/* OVERLAY */}
        <div
          className={overlayClass}
        />

        {/* CARD */}
        <div
          className="work-card group"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* SHARE BUTTON */}
          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenShare(true);
              }}
              className="card-button card-button-share"
            >
              ↗
            </button>
          )}

          {/* MENU BUTTON */}
          {isOwner && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              className="card-button card-button-menu"
            >
              ⋯
            </button>
          )}

          {/* TOP */}
          <div className="card-top max-w-[60%]">
            <h2 className="card-title">{work.title}</h2>

            <div className="card-type">
              {formatType(work.type)}
            </div>
          </div>

          {/* BOTTOM */}
          <div className="card-bottom">
            <span className="card-muted">
              {"★".repeat(work.rating ?? 0)}
            </span>

            <span className="card-muted">
              {formatStatus(work.status, work.type)}
            </span>
          </div>
        </div>

        {/* MENU */}
        {isOwner && (
          <CardMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      {/* MODALS */}
      <DeleteConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />

      <EditWorkModal
        work={work}
        open={openEdit}
        onClose={() => setOpenEdit(false)}
      />

      <ShareModal
        open={openShare}
        onClose={() => setOpenShare(false)}
        title={work.title}
        username={username}
        status={work.status}
        type={work.type}
        rating={work.rating}
      />
    </>
  );
}

/* =====================================================
  HELPERS
===================================================== */

function formatStatus(status: string, type: string) {
  const isGame = type === "game";
  const isReading = type === "book" || type === "manga";

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
    case "movie":
      return "Filme";
    case "series":
      return "Série";
    case "game":
      return "Jogo";
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