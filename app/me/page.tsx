import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { ensureUserProfile } from "@/lib/ensureUserProfile";

export default async function MePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  // 🔥 CRIA PROFILE SE PRECISAR
  await ensureUserProfile();

  // busca user criado
  const { data: profile } = await supabase
    .from("users")
    .select("username")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return redirect("/");
  }

  return redirect(`/${profile.username}`);
}