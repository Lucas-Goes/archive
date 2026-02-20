import { createClient } from "@/lib/supabase-server";

export async function ensureUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Usuário não autenticado." };

  // Verifica se o perfil já existe
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return { success: true, message: "Perfil já configurado." };

  const searchEmail = user.email?.trim().toLowerCase() ?? '';
  
  // Busca dados pendentes
  const { data: pending, error: pendingError } = await supabase
    .from("pending_users")
    .select("*")
    .ilike("email", searchEmail)
    .maybeSingle();

  if (!pending) {
    console.log("Nenhum dado pendente encontrado para este e-mail.");
    return { error: "Dados de cadastro não encontrados." };
  }

  // Cria o perfil
  const { error } = await supabase.from("users").insert({
    id: user.id,
    email: user.email,
    username: pending.username,
    name: pending.name,
    bio: pending.bio,
  });

  if (error) {
    if (error.message.includes("duplicate key")) {
      console.log("Conflito: Nome de usuário já está em uso.");
      return { error: "Este nome de usuário já está sendo usado. Por favor, escolha outro." };
    }

    console.error("Erro na inserção:", error);
    return { error: "Ocorreu um erro ao criar seu perfil. Tente novamente mais tarde." };
  }

  // Remove dos pendentes apenas após o sucesso
  await supabase
    .from("pending_users")
    .delete()
    .eq("email", user.email);

  return { success: true, message: "Perfil criado com sucesso!" };
}
