"use client";

import Link from "next/link";

export function MyProfileButton() {
  return (
    <Link
      href="/me"
      className="
        fixed top-25 right-3.5 z-50
        w-10 h-10
        rounded-full
        shadow-md
        flex items-center justify-center
        transition
        hover:scale-105
      "
      style={{
        backgroundColor: "var(--card-bg)",
        color: "var(--text)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Ícone usuário */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M14 14s-1-4-6-4-6 4-6 4h12z" />
      </svg>
    </Link>
  );
}
