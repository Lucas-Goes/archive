"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function SortMenu() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const currentSort = searchParams.get("sort") || "updated";

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);

    router.push(`?${params.toString()}`);
    setOpen(false);
  }

  // fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current) return;

      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // fechar com ESC
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div ref={ref} className="relative">

      {/* BOTÃO */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-10 h-10
          rounded-full
          flex items-center justify-center
          shadow-md
          transition
          hover:scale-105
        "
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        }}
      >
        ⇅
      </button>

      {/* MENU */}
      {open && (
        <div
          className="
            absolute right-0 mt-2
            w-40
            rounded-xl
            p-2
            space-y-1
          "
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Option
            label="Última Modificação"
            active={currentSort === "updated"}
            onClick={() => setSort("updated")}
          />

          <Option
            label="Data de Criação"
            active={currentSort === "created"}
            onClick={() => setSort("created")}
          />

          <Option
            label="Tipo da Obra"
            active={currentSort === "type"}
            onClick={() => setSort("type")}
          />
        </div>
      )}
    </div>
  );
}

function Option({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full text-left px-3 py-2 rounded-md text-sm transition"
      style={{
        backgroundColor: 
          hover
          ? "var(--footer-bg)"
          : "transparent",
        color: active ? "var(--text)" : "var(--muted)", 
        fontWeight: active ? 500 : 500,
      }}
    >
      {label}
    </button>
  );
}
