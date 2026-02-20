"use server";

import { createClient } from "@/lib/supabase-server";

/* =====================================================
  TYPES
===================================================== */
type RegisterResponse =
  | { success: true; username: string }
  | { error: string };

/* =====================================================
  HELPERS
===================================================== */
function translateAuthError(message: string) {
  if (message.includes("Password")) {
    return "A senha deve ter pelo menos 6 caracteres";
  }

  if (message.includes("User already registered")) {
    return "Email já está cadastrado";
  }

  return message;
}

/* =====================================================
  REGISTER
===================================================== */
export async function registerUser(
  formData: FormData
): Promise<RegisterResponse> {
  const supabase = await createClient();

  const email = (formData.get("email") as string)
  .toLowerCase()
  .trim();
  const password = formData.get("password") as string;
  const username = (formData.get("username") as string)
    .toLowerCase()
    .trim();
  const name = formData.get("name") as string;
  const bio = (formData.get("bio") as string) || "";

  /* =========================
    VALIDATION
  ========================= */
  if (!email || !password || !username || !name) {
    return { error: "Preencha todos os campos" };
  }

  /* =========================
    CHECK USERNAME
  ========================= */
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existingUser) {
    return { error: "Username já existe" };
  }

  /* =========================
    CHECK EMAIL
  ========================= */
  const { data: existingEmail } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingEmail) {
    return { error: "Email já está em uso" };
  }

  /* =========================
    CREATE AUTH USER
  ========================= */
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: translateAuthError(error?.message || "") };
  }

  /* =========================
    SAVE TEMP USER
  ========================= */
  const { error: pendingError } = await supabase
    .from("pending_users")
    .insert({
      email,
      username,
      name,
      bio,
    });

  if (pendingError) {
    return { error: "Erro ao salvar dados temporários" };
  }

  /* =========================
    SUCCESS
  ========================= */
  return {
    success: true,
    username,
  };
}

/* =====================================================
  LOGOUT
===================================================== */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/* =====================================================
  RESET PASSWORD
===================================================== */
export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    throw new Error("Erro ao enviar email");
  }

  return { success: true };
}