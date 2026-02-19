"use client";

import { useState } from "react";
import { resetPassword } from "@/app/actions/auth";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ResetPasswordModal({ open, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  // Função para limpar os campos e fechar o modal
  const handleClose = () => {
    setEmail("");
    setSuccess(false);
    onClose();
  };

  return (
    <div 
      className={`dark fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-md" onClick={handleClose} />

      {/* CONTENT */}
      <div
        className={`relative z-10 w-full max-w-sm p-8 rounded-2xl shadow-2xl transition-all duration-300 transform ${
          open ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
        style={{
          backgroundColor: "var(--card-bg, #000)",
          border: "1px solid var(--border, #333)",
        }}
      >
        <div className="mb-6 text-center">
          <h2 className="text-lg font-medium text-white/90 mb-1">Esquecer faz parte</h2>
          {!success && (
            <p className="text-sm text-white/50 mt-2">
              Mas enviaremos um link para você.
            </p>
          )}
        </div>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-center text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
              Email enviado! Verifique sua caixa de entrada.
            </p>
            <button onClick={handleClose} className="button-primary w-full">
              Voltar para o login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/30 ml-12">Email usado na criação do Archive</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o email"
                className="input-dark w-full"
              />
            </div>

            <button disabled={loading} className="button-primary w-full">
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
            
            <button 
              type="button" 
              onClick={handleClose} 
              className="w-full text-sm text-white/40 hover:text-white/60 transition py-2"
            >
              Cancelar e voltar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
