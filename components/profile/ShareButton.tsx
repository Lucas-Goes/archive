"use client";

import { useState } from "react";

export function ShareButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/${username}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-white/40 hover:text-white transition"
    >
      {copied ? "copiado" : "compartilhar"}
    </button>
  );
}
