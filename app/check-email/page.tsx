export default function CheckEmailPage() {
  return (
    <main className="bg-black min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4 max-w-sm">
        <h1 className="text-white text-xl font-semibold">
          Verifique seu email
        </h1>

        <p className="text-white/40">
          Enviamos um link de confirmação. Clique nele para ativar sua conta.
        </p>

        <p className="text-white/20 text-sm">
          Se não encontrar, veja na caixa de spam.
        </p>
      </div>
    </main>
  );
}