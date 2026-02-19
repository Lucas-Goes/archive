import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() { // 1. Torne a função async
  const cookieStore = await cookies(); // 2. Use await aqui

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { // O @supabase/ssr moderno prefere getAll/setAll
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // O erro aqui é normal se for chamado de um Server Component.
            // A atualização real do cookie deve ser feita no middleware.
          }
        },
      },
    }
  );
}

