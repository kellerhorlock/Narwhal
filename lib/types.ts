export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  total_tokens_used: number;
  tokens_today: number;
  streak_days: number;
  hours_this_month: number;
  created_at: string;
  narwhal_api_key?: string | null;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  tech_stack: string[];
  status: "active" | "published" | "stealth";
  tokens_used: number;
  commits: number;
  lines_changed: number;
  downloads: number;
  last_activity: string;
  created_at: string;
  landing_url?: string | null;
  download_url?: string | null;
  hidden_stats?: string[];
  thumbnail_url?: string | null;
  profiles?: Profile;
}
