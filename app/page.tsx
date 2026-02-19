import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { LandingClient } from "@/components/landing/LandingClient";

export default async function HomePage() {
  const supabase = await createClient();

  // 🔐 verificar usuário no server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // se estiver logado, redireciona direto (sem flicker)
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.username) {
      redirect(`/${profile.username}`);
    }
  }

  // se não estiver logado, mostra landing
  return <LandingClient />;
}
