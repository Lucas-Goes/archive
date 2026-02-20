import { createClient } from "@/lib/supabase-server";

export async function ensureUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("USER:", user);

  if (!user) return;

  // verifica se já existe
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  console.log("EXISTING:", existing);

  if (existing) return;

  const searchEmail = user.email?.trim().toLowerCase() ?? '';
  
  // busca pending
  const { data: pending, error: pendingError } = await supabase
    .from("pending_users")
    .select("*")
    .ilike("email", searchEmail)
    .maybeSingle();

  console.log("PENDING:", pending);
  console.log("PENDING ERROR:", pendingError);

  if (!pending) {
    console.log("NO PENDING USER FOUND");
    return;
  }

  // cria profile
  const { data, error } = await supabase
    .from("users")
    .insert({
      id: user.id,
      email: user.email,
      username: pending.username,
      name: pending.name,
      bio: pending.bio,
    })
    .select()
    .single();

  console.log("INSERT RESULT:", data);
  console.log("INSERT ERROR:", error);

  if (error) {
    return;
  }

  // remove pending
  await supabase
    .from("pending_users")
    .delete()
    .eq("email", user.email);
}