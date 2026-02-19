export interface UserProfile {
  id: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatar_url?: string;
  created_at: string;
}

