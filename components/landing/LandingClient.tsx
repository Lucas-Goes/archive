"use client";

import { useEffect, useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";

export function LandingClient() {
  const [mode, setMode] = useState<"idle" | "login" | "register">("idle");

  const isOpen = mode !== "idle";

  const endings = [
    "guardamos",
    "lembramos",
    "cuidamos",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % endings.length);
    }, 6000); // pausa entre trocas

    return () => clearInterval(interval);
  }, []);


  function close() {
    setMode("idle");
  }

  return (
    <main className="relative h-screen md:min-h-screen bg-black text-white overflow-hidden">

      {/* BACKGROUND BASE */}
      <div className="absolute inset-0 bg-black pointer-events-none" />

      {/* GLOW SUAVE */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/[0.06] via-transparent to-black pointer-events-none" />

      {/* WRAPPER GLOBAL */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 h-full flex flex-col">

        {/* NAVBAR */}
        <header className="flex items-center justify-between py-5">
          
          <div className="flex items-center gap-6">
            <span className="text-sm text-white/80">Archive</span>


            <Link href="/about" className="text-sm text-white/40 hover:text-white transition">
              Sobre
            </Link>
          </div>

          <button
            onClick={() => setMode("register")}
            className="text-sm px-3 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            Criar Archive
          </button>

        </header>

        {/* HERO */}
        <section className="flex flex-col md:grid md:grid-cols-2 flex-1 gap-12 md:h-full md:gap-0"> 

          {/* LEFT */}
          <div className="flex items-center pt-35 md:items-start md:pt-62">
            <div className="max-w-md space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-[1.3] text-white/90 relative">
                {/* linha fixa */}
                <div>
                  Nada fica.
                  <br />
                  <br />
                  E ainda sim
                </div>

                  {/* linha animada */}
                    <div className="relative h-[1.4em] overflow-hidden">
                      {endings.map((word, i) => (
                        <div
                          key={i}
                          className={`absolute left-0 top-0 transition-all duration-[1800ms] ease-[cubic-bezier(0.4,1,0.82,1)] ${
                            i === index
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-2"
                          }`}
                        >
                          {word}
                        </div>
                      ))}
                    </div>               
              </h1>
              <p className="text-sm text-white/30">
                ...
              </p>

            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col items-start gap-4 mt-auto pb-5 md:h-full md:items-end justify-center md:-translate-y-8.5">

            <span className="text-4xl md:text-2xl font-normal text-white/80 tracking-tight md:-translate-x-4">
              Archive
            </span>

            <button
              onClick={() => setMode("login")}
              className="text-sm px-8 py-2 md:px-6 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-white/70 hover:bg-white/10 hover:text-white transition md:-translate-x-1"

            >
              Acessar
            </button>

          </div>

        </section>

      </div>

      {/* MODAL */}
      <AuthModal open={isOpen} onClose={close}>
        {mode === "login" && (
          <>
            <h2 className="text-lg font-medium text-white/90 mb-1">
              Aproveite
            </h2>

            <p className="text-sm text-white/40 mb-6">
              Nada se perdeu
            </p>

            <LoginForm onSuccess={close} />
          </>
        )}

        {mode === "register" && (
          <>
            <h2 className="text-lg font-medium text-white/90 mb-1">
              Crie seu Archive
            </h2>

            <p className="text-sm text-white/40 mb-6">
              um lugar seu
            </p>

            <RegisterForm onSuccess={close} />
          </>
        )}
      </AuthModal>

    </main>
  );
}
