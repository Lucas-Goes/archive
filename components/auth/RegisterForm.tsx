"use client";

import { registerUser } from "@/app/actions/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  onSuccess?: () => void;
};

export function RegisterForm({ onSuccess }: Props) {
  const router = useRouter();

  // -------------------------
  // 1. STATES
  // -------------------------

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  // -------------------------
  // 2. FUNÇÃO CHECK USERNAME
  // -------------------------

  async function checkUsername(value: string) {
    if (!value) {
      setUsernameStatus("idle");
      return;
    }

    const normalized = value.toLowerCase().trim();

    setUsernameStatus("checking");

    try {
      const res = await fetch(`/api/check-username?username=${normalized}`);
      const data = await res.json();

      setUsernameStatus(data.available ? "available" : "taken");
    } catch {
      setUsernameStatus("idle");
    }
  }

  // -------------------------
  // 3. useEffect (DEBOUNCE)
  // -------------------------

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkUsername(username);
    }, 400);

    return () => clearTimeout(timeout);
  }, [username]);

  // -------------------------
  // 4. SUBMIT
  // -------------------------

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const password = formData.get("password") as string;

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (usernameStatus === "taken") {
      setError("Username já está em uso");
      setLoading(false);
      return;
    }

    if (usernameStatus === "checking") {
      setError("Verificando username...");
      setLoading(false);
      return;
    }

    const res = await registerUser(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    onSuccess?.();

    router.refresh();

    // 🔥 fallback seguro caso res.username não exista
    if (res?.username) {
      router.push(`/${res.username}`);
    }

    setLoading(false);
  }

  // -------------------------
  // 5. JSX
  // -------------------------

  return (
    <form action={handleSubmit} className="space-y-4">

      <input
        name="name"
        placeholder="Nome"
        required
        className="input-dark"
      />

      {/* USERNAME INPUT COM STATUS */}
      <div className="relative">

        <input
          name="username"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`input-dark pr-20 ${
            usernameStatus === "available"
              ? "border-green-500/40"
              : usernameStatus === "taken"
              ? "border-red-500/40"
              : ""
          }`}
        />

        {/* STATUS DENTRO DO INPUT */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none">

          {usernameStatus === "checking" && (
            <span className="text-white/30">•••</span>
          )}

          {usernameStatus === "available" && (
            <svg
              className="text-white/80"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {usernameStatus === "taken" && (
            <svg
              className="text-red-500/60"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          )}

        </div>

      </div>

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="input-dark"
      />

      <input
        name="password"
        type="password"
        placeholder="Senha"
        required
        className="input-dark"
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="button-primary"
      >
        {loading ? "Criando..." : "Criar Archive"}
      </button>

    </form>
  );
}
