"use server";

import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { redirect } from "next/navigation";

export async function uploadAvatar(formData: FormData) {
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;

  if (!file) return;

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}.${fileExt}`;
  const supabase = await createClient();

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    console.error(uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  const avatarUrl = data.publicUrl;

  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);

  if (updateError) {
    console.error(updateError);
    throw updateError;
  }

  return avatarUrl;
}

export async function updateProfile(formData: FormData) {
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("users")
    .update({
      name,
      bio,
    })
    .eq("id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Erro ao atualizar perfil");
  }
}

export async function deleteAccount() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const userId = user.id;

  // 1. deletar dados do usuário
  await supabaseAdmin.from("works").delete().eq("user_id", userId);
  await supabaseAdmin.from("users").delete().eq("id", userId);

  // 2. deletar auth user
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    console.error(error);
    throw new Error("Erro ao deletar conta");
  }

  // 3. deslogar (cookies)
  await supabase.auth.signOut();

  redirect("/");
}