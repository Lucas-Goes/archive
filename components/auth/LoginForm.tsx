"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ResetPasswordModal } from "@/components/auth/ResetPasswordModal";

type Props = {
  onSuccess?: () => void;
};

export function LoginForm({ onSuccess }: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openReset, setOpenReset] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      onSuccess?.();
      router.refresh();
      router.push("/me");
      // Não resetamos o loading aqui para evitar "flicker" antes do redirect
    } catch (err) {
      setError("Ocorreu um erro inesperado.");
      setLoading(false);
    }
  }

  return (
   <>
    <form onSubmit={handleLogin} className="space-y-4">
      <input
        type="email" // Melhoria: validação nativa
        required
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-dark w-full"
      />

      <div className="relative">
        <input
          required
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-dark pr-10 w-full"
        />

        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition"
        >
          {showPassword ? (
            <EyeOffIcon /> // Componentize os SVGs para limpar o código
          ) : (
            <EyeIcon />
          )} 
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button 
        type="submit" 
        disabled={loading} 
        className="button-primary w-full disabled:opacity-50"
      >
        {loading ? "Acessando..." : "Acessar"}
      </button>

      <p className="text-sm text-center">
        <button
          type="button"
          onClick={() => setOpenReset(true)}
          className="text-gray-500 cursor-pointer hover:underline font-normal text-[13px]"
        >
          Esqueceu a senha?  
        </button>
      </p>
    </form>
        <ResetPasswordModal 
          open={openReset} 
          onClose={() => setOpenReset(false)} 
        />
    </> 
  );
}

// Componentes auxiliares para os ícones
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2.5">
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth="2.5">
    <path d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M16.24 16.24A9.77 9.77 0 0112 17c-5 0-9-5-9-5a16.17 16.17 0 014.24-4.24M9.88 5.08A9.77 9.77 0 0112 5c5 0 9 5 9 5a16.17 16.17 0 01-2.16 2.94" />
  </svg>
);
