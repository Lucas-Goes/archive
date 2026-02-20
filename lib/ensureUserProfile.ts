import { createClient } from "@/lib/supabase-server";

export async function ensureUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // já existe?
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return;

  // busca pending
  const { data: pending } = await supabase
    .from("pending_users")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  if (!pending) return;

  // cria profile
  const { error } = await supabase.from("users").insert({
    id: user.id,
    email: user.email,
    username: pending.username,
    name: pending.name,
    bio: pending.bio,
  });

  if (error) {
    console.error("Error creating profile:", error);
    return;
  }

  // remove pending
  await supabase
    .from("pending_users")
    .delete()
    .eq("email", user.email);
}