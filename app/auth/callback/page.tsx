import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function AuthCallbackPage() {
  const supabase = await createClient();

  // pega sessão do link
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    return redirect("/");
  }

  // usuário confirmado → manda pro /me
  return redirect("/me");
}