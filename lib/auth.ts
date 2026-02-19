import { createClient } from "./supabase-server";

export async function getCurrentUser() {
  // 1. Adicione o await aqui para esperar o cliente ser criado
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
