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
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  // -------------------------
  // 2. CHECK USERNAME
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
  // 3. DEBOUNCE
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
  if (loading) return;

  setLoading(true);
  setError("");

  const password = formData.get("password") as string;

  if (!password || password.length < 6) {
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

  try {
    const res = await registerUser(formData);

    if (res && "success" in res) {
      setIsSuccess(true);
      setLoading(false);

      setTimeout(() => {
        window.location.href = "/check-email";
      }, 1500);

    } else if (res && "error" in res) {
      setError(res.error);
      setLoading(false);

    } else {
      setError("Resposta inesperada do servidor");
      setLoading(false);
    }

  } catch (err) {
    setError("Erro inesperado. Tente novamente.");
    setLoading(false);
  }
}

  // -------------------------
  // 5. JSX
  // -------------------------
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }}
      className="space-y-4"
    >
      {/* SUCCESS */}
      {isSuccess && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400 text-sm text-center animate-in fade-in zoom-in duration-300">
          <p className="font-bold">Registro feito com sucesso!</p>
          <p className="text-xs opacity-80">
            Redirecionando para confirmação de e-mail...
          </p>
        </div>
      )}

      {/* FORM */}
      {!isSuccess && (
        <>
          <input
            name="name"
            placeholder="Nome"
            required
            className="input-dark w-full"
          />

          {/* USERNAME */}
          <div className="relative">
            <input
              name="username"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`input-dark w-full pr-10 ${
                usernameStatus === "available"
                  ? "border-green-500/40"
                  : usernameStatus === "taken"
                  ? "border-red-500/40"
                  : ""
              }`}
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none">
              {usernameStatus === "checking" && (
                <span className="text-white/30">•••</span>
              )}

              {usernameStatus === "available" && (
                <svg
                  className="text-green-500"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <path
                    d="M5 13l4 4L19 7"
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
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <path
                    d="M6 6l12 12M6 18L18 6"
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
            className="input-dark w-full"
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              required
              className="input-dark w-full"
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* ERROR */}
          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading || usernameStatus === "checking"}
            className="button-primary w-full"
          >
            {loading ? "Criando..." : "Criar Archive"}
          </button>
        </>
      )}
    </form>
  );
}

// -------------------------
// ICONS
// -------------------------

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-4 h-4"
    strokeWidth="2.5"
  >
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-4 h-4"
    strokeWidth="2.5"
  >
    <path d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M16.24 16.24A9.77 9.77 0 0112 17c-5 0-9-5-9-5a16.17 16.17 0 014.24-4.24M9.88 5.08A9.77 9.77 0 0112 5c5 0 9 5 9 5a16.17 16.17 0 01-2.16 2.94" />
  </svg>
);