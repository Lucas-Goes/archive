"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");

    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  function toggleTheme() {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        w-7 h-7
        rounded-full
        border
        flex items-center justify-center
        shadow-sm
        transition
        hover:scale-105
      "
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border)",
      }}
    >
      <div
        className="w-3 h-3 rounded-full"
        style={{
          backgroundColor: isDark ? "#fff" : "#000",
        }}
      />
    </button>
  );
}