"use server";

import { createClient } from "@/lib/supabase-server";
import { getCurrentUser } from "@/lib/auth";

export async function createWork(formData: FormData) {
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string;
  const ratingValue = formData.get("rating") as string;

  const rating = ratingValue ? Number(ratingValue) : null;

  const user = await getCurrentUser();

  if (!user?.id) throw new Error("Not authenticated");

  console.log("USER ID:", user.id);
  console.log("USER OBJ:", user);

  const supabase = await createClient();

  const { error } = await supabase.from("works").insert({
    title,
    type,
    status,
    rating,
    user_id: user.id,
  });

  console.log("INSERT DATA:", {
    user_id: user.id,
  });

  if (error) {
    console.error("CREATE WORK ERROR:", error);
    throw new Error("Erro ao criar obra");
  }
}

export async function deleteWork(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔥 validação obrigatória
  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("works")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}


export async function updateWork(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const type = formData.get("type") as string;
  const status = formData.get("status") as string;
  const ratingValue = formData.get("rating");

  const rating = ratingValue ? Number(ratingValue) : null;

  const supabase = await createClient();

  // 🔐 pegar usuário autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔐 validação obrigatória
  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("works")
    .update({
      title,
      type,
      status,
      rating,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id); // 🔥 CRÍTICO

  if (error) {
    console.error("UPDATE ERROR:", error);
    throw new Error("Erro ao atualizar obra");
  }
}