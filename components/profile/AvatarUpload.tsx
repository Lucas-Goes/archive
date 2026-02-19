"use client";

import { uploadAvatar } from "@/app/actions/user";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

  function handleClick() {
    inputRef.current?.click();
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    setLoading(true);

    await uploadAvatar(formData);

    setLoading(false);
    router.refresh();
  }

 return (
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
     {/* IMAGEM */}
     {avatarUrl ? (
       <img
         src={`${avatarUrl}?t=${Date.now()}`}
         alt="avatar"
         className="
           absolute
           inset-0
           w-full h-full
           object-cover
         "
       />
     ) : (
       <div className="w-full h-full flex items-center justify-center text-xs">
         +
       </div>
     )}
 
     {/* OVERLAY */}
     <div
       className="
         absolute inset-0
         bg-black/40
         opacity-0 group-hover:opacity-100
         transition
         flex items-center justify-center
         text-white text-xs
       "
     >
       Alterar
     </div>
 
     {/* LOADING */}
     {loading && (
       <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs">
         Enviando...
       </div>
     )}
 
     {/* INPUT */}
     <input
       ref={inputRef}
       type="file"
       accept="image/*"
       onChange={handleChange}
       className="hidden"
     />
   </div>
 );
}