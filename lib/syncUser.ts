import { createClient } from "@/lib/supabase-server";

export async function syncUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // verifica se já existe
  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (existing) return existing;

  // cria novo user
  const { data, error } = await supabase
    .from("users")
    .insert({
      id: user.id,
      username: user.email?.split("@")[0],
      name: user.email,
      bio: "",
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}