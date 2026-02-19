"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export function StarRating({ value, onChange }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);

return (
  <div className="flex gap-1 text-2xl">
    {[1, 2, 3, 4, 5].map((i) => {
      const active = hover ? i <= hover : value !== null && i <= value;

      return (
        <button
          key={i}
          type="button"
          onClick={() => onChange(value === i ? null : i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          className="transition transform hover:scale-110"
          style={{
            color: active ? "#facc15" : "var(--muted)",
            textShadow: active
              ? "0 2px 6px rgba(250, 204, 21, 0.6)"
              : "none",
          }}
        >
          ★
        </button>
      );
    })}
  </div>
);
}