import { createClient } from "@/lib/supabase-server";
import { UserProfile } from "@/types/user";
import { Work } from "@/types/work";


export async function getUserByUsername(
  username: string
): Promise<UserProfile | null> {

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function getWorksByUser(
  userId: string,
  sort: string = "updated"
): Promise<Work[]> {
  const supabase = await createClient();
  let query = supabase
  .from("works")
  .select("*")
  .eq("user_id", userId);

switch (sort) {
  case "created":
    query = query.order("created_at", { ascending: false });
    break;

  case "type":
    query = query.order("type", { ascending: true });
    break;

  default:
    query = query.order("updated_at", { ascending: false });
}

const { data, error } = await query;

if (error) {
  console.error(error);
  return [];
}

return data;
}