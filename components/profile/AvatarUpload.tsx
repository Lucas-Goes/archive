"use client";

import { uploadAvatar } from "@/app/actions/user";
import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

export function AvatarUpload({
  userId,
  avatarUrl,
}: {
  userId: string;
  avatarUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);


  useEffect(() => {
  return () => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
  };
}, [imageSrc]);

  function handleClick() {
    inputRef.current?.click();
  }

  function closeModal() {
  setImageSrc(null);

  if (inputRef.current) {
    inputRef.current.value = "";
  }
}

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageDataUrl = URL.createObjectURL(file);
    setImageSrc(imageDataUrl);
  }

  const onCropComplete = useCallback((_: any, areaPixels: any) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function handleSave() {
    if (!imageSrc || !croppedAreaPixels) return;

    const blob = await getCroppedImg(imageSrc, croppedAreaPixels);

    const formData = new FormData();
    formData.append("file", blob, "avatar.jpg");
    formData.append("userId", userId);

    setLoading(true);

    await uploadAvatar(formData);

    setLoading(false);
    closeModal();
    router.refresh();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setImageSrc(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* AVATAR */}
      <div
        onClick={handleClick}
        className="
          relative
          w-35 h-35
          rounded-full
          overflow-hidden
          cursor-pointer
          group
          flex items-center justify-center
        "
        style={{
          border: "1px solid var(--border)",
          backgroundColor: "var(--card-bg)",
        }}
      >
        {avatarUrl ? (
          <img
            src={`${avatarUrl}?t=${Date.now()}`}
            alt="avatar"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="text-xs">+</div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs">
          Alterar
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs">
            Enviando...
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* MODAL */}
      {imageSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(12px)",
          }}
          onClick={closeModal}
        >
          <div
            className="
              w-full max-w-sm
              rounded-2xl
              animate-modal
              overflow-hidden
            "
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-md)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center font-semibold justify-between px-4 py-3 text-sm border-b border-[var(--border)]">
              <span>Ajustar foto</span>
              <button
                onClick={() => setImageSrc(null)}
                className="opacity-60 hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>

            {/* CROPPER */}
            <div className="relative w-full h-[300px] bg-black">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* CONTROLES */}
            <div className="p-4 flex flex-col gap-4">
              {/* ZOOM */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                  className="
                    w-9 h-9
                    flex items-center justify-center
                    rounded-full
                    text-sm
                    border border-[var(--border)]
                    hover:bg-white/5
                    active:scale-90
                    transition
                  "
                >
                  −
                </button>

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-[var(--primary)]"
                />

                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                  className="
                    w-9 h-9
                    flex items-center justify-center
                    rounded-full
                    text-sm
                    border border-[var(--border)]
                    hover:bg-white/5
                    active:scale-90
                    transition
                  "
                >
                  +
                </button>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <button
                  onClick={() => setImageSrc(null)}
className="
                        w-full p-3 rounded-lg
                        font-semibold
                        transition
                        flex items-center justify-center gap-2
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                        backdrop-blur-md
                    "
                    style={{
                        backgroundColor: "var(--footer-bg)",
                        color: "var(--text)",
                        border: "1px solid var(--border)",
                    }}
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSave}
                  className="
                        w-full p-3 rounded-lg
                        font-semibold
                        transition
                        flex items-center justify-center gap-2
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                        backdrop-blur-md
                    "
                    style={{
                        backgroundColor: "var(--footer-bg)",
                        color: "var(--text)",
                        border: "1px solid var(--border)",
                    }}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}