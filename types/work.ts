export type WorkType =
  | "movie"
  | "series"
  | "book"
  | "game"
  | "anime"
  | "manga";

export type WorkStatus =
  | "in_progress"
  | "want"
  | "finished";

export interface Work {
  id: string;
  user_id: string;
  title: string;
  subtitle?: string;
  type: WorkType;
  status: WorkStatus;
  rating?: number;
  created_at: string;
  updated_at: string;
}