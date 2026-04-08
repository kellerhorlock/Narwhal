-- Project fields (from previous migration)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS landing_url text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS download_url text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS hidden_stats text[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS commits integer DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS lines_changed integer DEFAULT 0;

-- API key system
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS narwhal_api_key text UNIQUE;

-- Backfill existing users with API keys
UPDATE profiles SET narwhal_api_key = gen_random_uuid()::text WHERE narwhal_api_key IS NULL;

-- Auto-generate API key for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, narwhal_api_key)
  VALUES (new.id, coalesce(new.raw_user_meta_data->>'username', 'user_' || left(new.id::text, 8)), gen_random_uuid()::text);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- News feed cache
CREATE TABLE IF NOT EXISTS news_feed (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  source text,
  category text,
  url text,
  timestamp text,
  palette integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);
