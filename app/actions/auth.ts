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
function normalize(value: string) {
  return value.toLowerCase().trim();
}

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

  const email = normalize(formData.get("email") as string);
  const password = formData.get("password") as string;
  const username = normalize(formData.get("username") as string);
  const name = (formData.get("name") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim() || "";

  /* =========================
    VALIDATION
  ========================= */
  if (!email || !password || !username || !name) {
    return { error: "Preencha todos os campos" };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres" };
  }

  /* =========================
    CHECK USERNAME (GLOBAL)
  ========================= */
  // Se você já tem essa RPC, ela é o melhor lugar pra validar tudo
  const { data: isTaken, error: rpcError } = await supabase.rpc(
    "is_username_taken",
    {
      p_username: username,
    }
  );

  if (rpcError) {
    console.error("RPC error:", rpcError);
    return { error: "Erro ao validar username" };
  }

  if (isTaken) {
    return { error: "Username já está em uso" };
  }

  /* =========================
    CHECK EMAIL (users)
  ========================= */
  const { data: existingEmail, error: emailError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .limit(1);

  if (emailError) {
    console.error("Email check error:", emailError);
    return { error: "Erro ao validar email" };
  }

  if (existingEmail && existingEmail.length > 0) {
    return { error: "Email já está em uso" };
  }

  /* =========================
    CHECK PENDING USERS
  ========================= */
  const { data: existingPending, error: pendingCheckError } = await supabase
    .from("pending_users")
    .select("id")
    .eq("username", username)
    .limit(1);

  if (pendingCheckError) {
    console.error("Pending check error:", pendingCheckError);
    return { error: "Erro ao validar username" };
  }

  if (existingPending && existingPending.length > 0) {
    return { error: "Alguém teve essa ideia recentemente :)" };
  }

  /* =========================
    CREATE AUTH USER
  ========================= */
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError || !data.user) {
    return {
      error: translateAuthError(signUpError?.message || "Erro ao criar usuário"),
    };
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
    console.error("Insert pending error:", pendingError);
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
    redirectTo: "https://archive-me.com/reset-password",
  });

  if (error) {
    throw new Error("Erro ao enviar email");
  }

  return { success: true };
}