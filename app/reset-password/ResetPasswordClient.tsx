
"use client"; 

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {  useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isValidating, setIsValidating] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false); // Estado de sucesso
  const [showPassword, setShowPassword] = useState(false); // Estado do olho

  useEffect(() => {
    async function validateSession() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        // Se não tem code, verifica se já existe uma sessão ativa (caso o redirect já tenha funcionado)
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setMessage("Link inválido ou expirado.");
        }
        setIsValidating(false);
        return;
      }

      // Troca o código pela sessão
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Erro na troca de código:", error.message);
        setMessage("Link inválido ou expirado.");
      } else {
        // Limpa a mensagem de erro caso a sessão seja válida
        setMessage(""); 
      }

      setIsValidating(false);
    }

    validateSession();
  }, []);

  async function handleUpdate() {
    setMessage("Atualizando...");
    
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });

    console.log("UPDATE RESULT:", data, error);

    if (error) {
      setMessage(`Erro: ${error.message}`);
      return;
    }

    setMessage("Senha atualizada com sucesso!");
    setIsSuccess(true); // Ativa o bloqueio do botão

    // Redireciona após 2 segundos para a página inicial
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  if (isValidating) {
    return (
      <main className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-white/40">Validando acesso...</p>
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen flex items-center justify-center">
      <div className="bg-black space-y-4 w-80">
        <h1 className="text-lg font-semibold text-center">
          <p className="text-nd text-white/40 mb-6">
            Crie sua nova senha pro Archive
          </p>
        </h1>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Digite a nova senha"
            value={password}
            disabled={isSuccess}
            onChange={(e) => setPassword(e.target.value)}
            className="input-dark w-full p-2 bg-zinc-900 text-white border border-white/10 rounded pr-10"
          />
          
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
          </button>
        </div>

        <button 
          onClick={handleUpdate} 
          className="button-primary w-full py-2 bg-white text-black rounded font-medium hover:bg-zinc-200 transition-colors"
          disabled={!password || !!message.includes("inválido") || isSuccess}
          style={{ 
            opacity: isSuccess ? 0.4 : 1, 
            cursor: isSuccess ? "not-allowed" : "pointer" 
          }}
        >
          {isSuccess ? "Senha atualizada" : "Atualizar senha"}
        </button>

        {message && (
          <p className="text-sm text-white/40 text-center mt-4">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
