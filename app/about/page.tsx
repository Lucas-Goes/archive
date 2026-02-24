"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function AboutPage() {
  const lines = [
    "Archive não é uma ferramenta de organização.",
    "Não é sobre controlar o que você viu.",
    "Nem transformar memória em palco.",

    "É um espaço silencioso.",
    "Um lugar para existir.",
    "Sem precisar justificar presença.",

    "O que você viu, leu, jogou.",
    "O que ficou com você de alguma forma.",

    "Nada permanece inteiro.",
    "Mas algo sempre fica.",

    "Archive existe para isso.",
    "Não para medir.",
    "Para guardar.",

    "Aqui não há métricas nem rankings sociais.",
    "Não há performance.",
    "Não é pela razão. É pela emoção.",
  ];

  const hoverTimeouts = useRef<number[]>([]);

  const [showEnd, setShowEnd] = useState(false);

  // DETECTA MOBILE
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.innerWidth < 768;
  }, []);
  

  // VISIBILIDADE POR LINHA
  const [visible, setVisible] = useState<boolean[]>(
    Array(lines.length).fill(false)
  );

  function revealIndex(i: number) {
    setVisible((prev) => {
      if (prev[i]) return prev;

      const copy = [...prev];
      copy[i] = true;

      playSound();
      return copy;
    });
  }

  function revealNext() {
    setVisible((prev) => {
      const index = prev.findIndex((v) => !v);
      if (index === -1) return prev;

      const copy = [...prev];
      copy[index] = true;

      playSound();
      return copy;
    });
  }

  function handleHoverStart(i: number) {
    if (isMobile.current) return;

    hoverTimeouts.current[i] = window.setTimeout(() => {
      revealIndex(i);
    }, 400); // tempo que precisa "permanecer" na linha
  }

  function handleHoverEnd(i: number) {
    if (hoverTimeouts.current[i]) {
      clearTimeout(hoverTimeouts.current[i]);
    }
  }

  useEffect(() => {
  if (visible.every(Boolean)) {
    const t = setTimeout(() => {
      setShowEnd(true);
    }, 600); // delay final (ajuste se quiser)

    return () => clearTimeout(t);
  }
}, [visible]);

  // POSIÇÃO
  const target = useRef({ x: 0, y: 120 });
  const current = useRef({ x: 0, y: 120 });

  // ROTAÇÃO (premium)
  const rotation = useRef(0);
  const targetRotation = useRef(0);
  const velocity = useRef(0);

  const [, forceRender] = useState(0);

  const lastY = useRef(0);
  const lastReveal = useRef(0);
  const isTouch = useRef(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const MAX_STEP = 45;

  // INIT
  useEffect(() => {
    const x = window.innerWidth / 2;
    target.current.x = x;
    current.current.x = x;
  }, []);

  // AUDIO
  useEffect(() => {
    audioRef.current = new Audio("/tick.mp3");
    audioRef.current.volume = 0.12;
  }, []);

  function playSound() {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }

  // FOCO DA LUZ
  function focusOn(x: number, y: number) {
    const dx = x - current.current.x;
    const dy = y - current.current.y;

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    let diff = angle - rotation.current;
    diff = ((diff + 180) % 360) - 180;

    if (diff > MAX_STEP) diff = MAX_STEP;
    if (diff < -MAX_STEP) diff = -MAX_STEP;

    targetRotation.current = rotation.current + diff;

    velocity.current += diff * 0.08;
  }

  // LOOP
  useEffect(() => {
    let raf: number;
    let time = 0;

    const animate = () => {
      const ease = 0.08;

      // POSIÇÃO
      current.current.x += (target.current.x - current.current.x) * ease;
      current.current.y += (target.current.y - current.current.y) * ease;

      // DRIFT SUTIL
      time += 0.01;

      current.current.x += Math.sin(time * 1.3) * 0.4;
      current.current.y += Math.cos(time * 1.1) * 0.4;

      // ROTAÇÃO
      let diff = targetRotation.current - rotation.current;
      diff = ((diff + 180) % 360) - 180;

      velocity.current += diff * 0.02;
      velocity.current *= 0.9;

      rotation.current += velocity.current;

      if (Math.abs(diff) < 0.01 && Math.abs(velocity.current) < 0.01) {
        velocity.current = 0;
        rotation.current = targetRotation.current;
      }

      forceRender((n) => n + 1);
      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  // INPUT

  function handleMove(e: any) {
    if ("touches" in e) {
      target.current.x = e.touches[0].clientX;
      target.current.y = e.touches[0].clientY;
    } else {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    }
  }

  function handleClick(e: React.MouseEvent) {
    if (isTouch.current) return;
    focusOn(e.clientX, e.clientY);
  }

  function handleTouchStart(e: React.TouchEvent) {
    isTouch.current = true;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;

    focusOn(x, y);
    handleMove(e);
    revealNext();
  }

  function handleTouchMove(e: React.TouchEvent) {
    isTouch.current = true;

    const y = e.touches[0].clientY;

    handleMove(e);

    if (Math.abs(y - lastY.current) > 60) {
      const now = Date.now();
      if (now - lastReveal.current > 400) {
        revealNext();
        lastReveal.current = now;
      }

      lastY.current = y;
    }
  }

  function handleTouchEnd() {
    setTimeout(() => {
      isTouch.current = false;
    }, 200);
  }

  return (
    <main
      className="min-h-[100dvh] bg-black text-white relative overflow-hidden select-none"
      onMouseMove={handleMove}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* LUZ */}
      <div
        className="pointer-events-none fixed z-0"
        style={{
          left: current.current.x,
          top: current.current.y,
          transform: `translate(-50%, -50%) rotate(${rotation.current}deg)`,
        }}
      >
        <div className="relative">
          <div className="absolute w-[180px] h-[180px] bg-white/5 blur-[80px] animate-noise1" />
          <div className="absolute w-[140px] h-[140px] bg-white/6 blur-[60px] animate-noise2" />
          <div className="absolute w-[100px] h-[100px] bg-white/10 blur-[40px] animate-noise3" />

          <div className="absolute w-[120px] h-[60px] bg-white/15 blur-[30px] rounded-full translate-x-8" />
          <div className="absolute w-[80px] h-[40px] bg-white/25 blur-[20px] rounded-full translate-x-5" />

          <div className="w-[6px] h-[6px] rounded-full bg-white animate-core" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <header className="flex items-center justify-between py-5">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-white/30 hover:text-white transition">
              Archive
            </Link>
            <span className="text-sm text-white/80">Sobre</span>
          </div>

          <Link
            href="/"
            className="text-sm px-8 py-2 md:px-6 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            Voltar
          </Link>
        </header>

        <div className="pt-16 pb-24">
          <div className="max-w-md w-full pl-3 border-l border-white/10">
            <div className="text-base md:text-sm text-white/80 leading-relaxed space-y-3 tracking-tight">

              {lines.map((line, i) => (
                <p
                  key={i}
                  onMouseEnter={() => handleHoverStart(i)}
                  onMouseLeave={() => handleHoverEnd(i)}
                  className={`transition-all duration-[4200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    visible[i]
                      ? "opacity-100 blur-0 translate-y-0"
                      : "opacity-0 blur-[14px] translate-y-3"
                  }`}
                >
                  {line}
                </p>
              ))}

            </div>

            {visible.every(Boolean) && (
             <div
                className={`mt-20 flex items-baseline gap-4 transition-all duration-[5000ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  showEnd
                    ? "opacity-100 blur-0 translate-y-0"
                    : "opacity-0 blur-[20px] translate-y-6"
                }`}
              >
                <span className="text-sm text-white/30 tracking-wide">
                  mono no aware
                </span>

                <span
                  className="text-sm font-semibold text-white/80 tracking-wide"
                  style={{ transitionDelay: "400ms" }}
                >
                  物の哀れ
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ANIMAÇÕES */}
      <style jsx>{`
        @keyframes noise1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-10px,6px) scale(1.1); }
        }

        @keyframes noise2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(8px,-6px) scale(1.15); }
        }

        @keyframes noise3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-6px,-10px) scale(1.08); }
        }

        .animate-noise1 { animation: noise1 6s ease-in-out infinite; }
        .animate-noise2 { animation: noise2 8s ease-in-out infinite; }
        .animate-noise3 { animation: noise3 5s ease-in-out infinite; }

        @keyframes core {
          0%,100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.4); opacity: 1; }
        }

        .animate-core {
          animation: core 2s ease-in-out infinite;
        }

      * {
        -webkit-touch-callout: none;
      }

      * {

      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    * {
  -webkit-tap-highlight-color: transparent;
}

<main
  style={{ touchAction: "manipulation" }}

      `}</style>
    </main>
  );
}