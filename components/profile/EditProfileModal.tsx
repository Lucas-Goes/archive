"use client";

import { useState } from "react";
import { updateProfile, deleteAccount } from "@/app/actions/user";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

interface Props {
  name: string;
  bio: string;
}

export function EditProfileModal({ name, bio }: Props) {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await updateProfile(formData);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      {/* BOTÃO EDITAR */}
      <button
        onClick={() => setOpen(true)}
        className="mt-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
      >
        ✎
      </button>

      {/* MODAL PRINCIPAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* CARD */}
          <div
            className="relative z-10 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-xl"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium opacity-70">
                Perfil
              </h2>

            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="opacity-40 hover:opacity-80 transition-opacity"
            >
              <Settings size={16} />
            </button>
            </div>

            <form action={handleSubmit} className="space-y-5">
              
              {/* CAMPO NOME */}
              <div className="text-left"> {/* Mudamos para flex-col para alinhar tudo à esquerda */}
                <label className="text-[11px] opacity-80 px-1 uppercase">Seu Nome</label>
                <input
                  name="name"
                  defaultValue={name}
                  className="w-full p-2.5 rounded-lg border bg-transparent outline-none focus:border-blue-500"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>

              {/* CAMPO BIO */}
              <div className="text-left">
                <label className="text-[11px] opacity-80 px-1 uppercase">Se Expresse</label>
                <textarea
                  name="bio"
                  defaultValue={bio}
                  rows={3}
                  className="w-full p-2.5 rounded-lg border bg-transparent outline-none focus:border-blue-500 resize-none"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>

              {/* FOOTER */}
              <div className="flex justify-end pt-0">
                <button
                  type="submit"
                  className="w-full p-3 rounded-lg font-medium mt-0"
                  style={{
                    backgroundColor: "var(--footer-bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIGURAÇÕES (NÃO FECHA O PRINCIPAL) */}
      {open && showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* BACKDROP SEM FECHAR MODAL PRINCIPAL */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />

          <div
            className="relative z-10 w-full max-w-xs p-6 rounded-2xl text-center space-y-4 shadow-xl"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border)",
            }}
          >
            <h3 className="text-sm font-bold text-red-800">
              Excluir conta no Archive
            </h3>

            <p className="text-xs opacity-60 leading-relaxed">
              Esta ação é permanente. Todos os seus dados serão removidos.
            </p>

            <div className="space-y-2">
              <button
                onClick={async () => {
                  await deleteAccount();
                  setShowSettings(false);
                  setOpen(false);
                }}
                className="w-full py-2 rounded-lg text-sm font-medium bg-red-900 text-white hover:bg-red-700 transition-colors"
              >
                Excluir conta
              </button>

              <button
                onClick={() => setShowSettings(false)}
                className="text-xs opacity-50 hover:opacity-80 transition-opacity"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
