"use client";

import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.refresh();    
  }
  return (
      <button
        onClick={handleLogout}
        className="
          w-7 h-7
          rounded-full
          flex items-center justify-center
          transition
          hover:scale-105
          active:scale-95
        "
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        }}
      >
        <span className="text-sm">⨯</span>
      </button>
  );
}