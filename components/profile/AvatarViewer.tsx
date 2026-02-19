"use client";

import { useState } from "react";

interface Props {
  avatarUrl?: string | null;
}

export function AvatarViewer({ avatarUrl }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => avatarUrl && setOpen(true)}
        className="cursor-pointer"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            className="w-35 h-35 rounded-full object-cover"
          />
        ) : (
          <div className="w-35 h-35 rounded-full bg-neutral-300" />
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <img
            src={avatarUrl!}
            className="relative z-10 w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full object-cover"
          />
        </div>
      )}
    </>
  );
}
