import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function MePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // buscar profile - Esse codigo serve para redirecionar pro perfi ou pra home atraves da /me
  const { data: profile } = await supabase
    .from("users")
    .select("username")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/");
  }

  redirect(`/${profile.username}`);
}