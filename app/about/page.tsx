import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* WRAPPER (igual landing) */}
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        {/* HEADER */}
        <header className="flex items-center justify-between py-5">

          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm text-white/80 hover:text-white transition">
              Archive
            </Link>

            <span className="text-sm text-white/30">
              Sobre
            </span>
          </div>

          <Link
            href="/"
            className="text-sm px-8 py-2 md:px-6 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-white/70 hover:bg-white/10 hover:text-white transition "
          >
            Voltar
          </Link>

        </header>

        {/* CONTENT */}
        <div className="py-1">

          <div className="max-w-lg w-full pl-4 border-l border-white/10">

            {/* BLOCO PRINCIPAL */}
            <div className="text-base md:text-sm text-white/90 leading-relaxed space-y-1">

              <p>Archive não é uma ferramenta de organização.</p>
              <p>Não é sobre controlar o que você viu.</p>
              <p>Nem transformar memória em palco.</p>

              <p>É um espaço silencioso.</p>
              <p>Um lugar para existir.</p>
              <p>Sem precisar justificar presença.</p>

              <p>O que você viu, leu, jogou.</p>
              <p>O que ficou com você de alguma forma.</p>

              <p>Nada permanece inteiro.</p>
              <p>Mas algo sempre fica.</p>

              <p>Archive existe para isso.</p>
              <p>Não para medir.</p>
              <p>Para guardar.</p>

              <p>Aqui não há métricas nem rankings sociais.</p>
              <p>Não há performance.</p>
              <p>Não é pela razão! É pela emoção.</p>

            </div>

            {/* CONCEITO */}
            <div className="mt-8 flex items-baseline gap-4">

              <span className="text-sm text-white/40 tracking-wide">
                mono no aware
              </span>

              <span className="text-sm font-semibold text-white/80 tracking-wide">
                物の哀れ
              </span>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
