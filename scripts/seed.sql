-- ═══════════════════════════════════════
-- Narwhal Seed Data
-- Tokens are calculated live by the frontend:
--   (lines_changed * 80) + (commits * 25000)
-- So total_tokens_used and tokens_used are 0.
-- ═══════════════════════════════════════

-- Clean up previous seed data
DELETE FROM follows WHERE follower_id LIKE 'a0000001-%' OR following_id LIKE 'a0000001-%';
DELETE FROM projects WHERE user_id LIKE 'a0000001-%';
DELETE FROM profiles WHERE id LIKE 'a0000001-%';

-- ═══════════════════════════════════════
-- BLOCK 1: PROFILES
-- ═══════════════════════════════════════

INSERT INTO profiles (id, username, display_name, bio, total_tokens_used, tokens_today, streak_days, hours_this_month, created_at, narwhal_api_key) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'alexr', 'Alex Reeves', 'Ex-Stripe engineer. Now building indie tools with Claude. San Francisco.', 0, 0, 12, 43, now() - interval '97 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000002', 'samip', 'Sami Patel', 'Design engineer obsessed with motion. Previously at Vercel.', 0, 0, 28, 68, now() - interval '134 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000003', 'jordanm', 'Jordan Mensah', 'Full-stack builder. 3 exits. Now vibe coding my next thing.', 0, 0, 45, 80, now() - interval '162 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000004', 'yukit', 'Yuki Tanaka', 'Rust evangelist. Building CLI tools that don''t suck.', 0, 0, 33, 72, now() - interval '148 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000005', 'niao', 'Nia Okafor', 'AI researcher turned builder. Making ML accessible to everyone.', 0, 0, 19, 55, now() - interval '112 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000006', 'marcor', 'Marco Rossi', 'Mobile dev from Milan. SwiftUI maximalist.', 0, 0, 22, 48, now() - interval '126 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000007', 'priyak', 'Priya Krishnamurthy', 'Backend architect. Distributed systems nerd. Building in Golang.', 0, 0, 38, 60, now() - interval '155 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000008', 'dantew', 'Dante Williams', 'Creative coder. Making art with algorithms.', 0, 0, 15, 44, now() - interval '108 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000009', 'elisef', 'Elise Fontaine', 'Ex-Google PM. Now building tools for solo founders.', 0, 0, 41, 75, now() - interval '171 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000010', 'kail', 'Kai Lindström', 'Swedish indie hacker. Building profitable tools, not venture-backed unicorns.', 0, 0, 26, 52, now() - interval '140 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000011', 'zaraa', 'Zara Ahmed', 'Data visualization obsessive. Making numbers beautiful.', 0, 0, 11, 38, now() - interval '95 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000012', 'tommyn', 'Tommy Nguyen', '17-year-old builder. Shipping faster than most adults.', 0, 0, 9, 30, now() - interval '78 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000013', 'rosam', 'Rosa Martinez', 'Healthcare tech builder. Fixing broken systems with code.', 0, 0, 30, 58, now() - interval '145 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000014', 'chriso', 'Chris Olsen', 'DevTools builder. Making developers 10x more productive.', 0, 0, 17, 45, now() - interval '118 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000015', 'aishak', 'Aisha Kamara', 'Fintech builder. Democratizing financial tools for Africa.', 0, 0, 36, 70, now() - interval '168 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000016', 'leoc', 'Leo Chen', 'Game dev meets AI. Making interactive experiences that learn.', 0, 0, 24, 65, now() - interval '130 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000017', 'fatimah', 'Fatima Al-Hassan', 'NLP researcher. Building language tools for Arabic speakers.', 0, 0, 20, 37, now() - interval '105 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000018', 'benh', 'Ben Harper', 'Ex-Netflix engineer. Building the future of streaming tools.', 0, 0, 14, 42, now() - interval '115 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000019', 'ninak', 'Nina Kowalski', 'Accessibility advocate. Building inclusive tools.', 0, 0, 8, 25, now() - interval '82 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000020', 'jakeo', 'Jake Oduya', 'Sports tech builder. Data nerd. Arsenal fan.', 0, 0, 31, 62, now() - interval '152 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000021', 'mias', 'Mia Sørensen', 'Copenhagen-based. Building calm software.', 0, 0, 7, 22, now() - interval '88 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000022', 'ravip', 'Ravi Patel', 'API builder. Making integrations painless.', 0, 0, 25, 50, now() - interval '138 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000023', 'sophied', 'Sophie Dubois', 'French-Canadian. Building education tools with AI.', 0, 0, 16, 40, now() - interval '110 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000024', 'oscarm', 'Oscar Mendez', 'Automation junkie. If I do it twice, I automate it.', 0, 0, 21, 48, now() - interval '125 days', gen_random_uuid()),
  ('a0000001-0000-0000-0000-000000000025', 'lenav', 'Lena Voss', 'Berlin-based. Building tools for the creator economy.', 0, 0, 18, 55, now() - interval '132 days', gen_random_uuid())
ON CONFLICT (id) DO NOTHING;


-- ═══════════════════════════════════════
-- BLOCK 2: PROJECTS
-- ═══════════════════════════════════════

-- Alex Reeves
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'PayKit', 'Drop-in payment components for indie hackers. Stripe integration in 3 lines of code.', '{"React","Stripe API","TypeScript"}', 'published', 0, 234, 5600, 482, now() - interval '3 hours', now() - interval '90 days'),
  ('a0000001-0000-0000-0000-000000000001', 'InvoiceBot', 'AI that reads your emails and auto-generates invoices. Never chase payments again.', '{"Python","Claude API","Gmail API"}', 'published', 0, 167, 3400, 215, now() - interval '2 days', now() - interval '75 days')
ON CONFLICT DO NOTHING;

-- Sami Patel
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000002', 'MotionKit', 'Production-ready animation components for React. 60fps or your money back.', '{"React","Framer Motion","TypeScript"}', 'published', 0, 445, 12800, 312, now() - interval '5 hours', now() - interval '128 days'),
  ('a0000001-0000-0000-0000-000000000002', 'Chromaflow', 'Real-time color palette generator that understands your brand''s personality.', '{"Svelte","Claude API","Canvas"}', 'published', 0, 189, 4200, 189, now() - interval '1 day', now() - interval '95 days')
ON CONFLICT DO NOTHING;

-- Jordan Mensah
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000003', 'LaunchStack', 'The fastest way to go from idea to deployed SaaS. Auth, payments, dashboard — all wired up.', '{"Next.js","Supabase","Stripe","Tailwind"}', 'published', 0, 892, 28400, 456, now() - interval '2 hours', now() - interval '158 days'),
  ('a0000001-0000-0000-0000-000000000003', 'WaitlistPro', 'Beautiful waitlist pages with built-in referral tracking. Used by 200+ launches.', '{"Next.js","Resend","Supabase"}', 'published', 0, 234, 5600, 387, now() - interval '8 hours', now() - interval '120 days'),
  ('a0000001-0000-0000-0000-000000000003', 'Roast My Landing', 'AI that reviews your landing page and gives brutally honest UX feedback.', '{"Next.js","Claude API","Puppeteer"}', 'active', 0, 156, 3800, 0, now() - interval '6 hours', now() - interval '45 days')
ON CONFLICT DO NOTHING;

-- Yuki Tanaka
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000004', 'quickserve', 'Zero-config local dev server with live reload. 10x faster than anything Node-based.', '{"Rust","tokio","hyper"}', 'published', 0, 612, 15600, 423, now() - interval '4 hours', now() - interval '142 days'),
  ('a0000001-0000-0000-0000-000000000004', 'tui-graph', 'Beautiful graphs in your terminal. Sparklines, bar charts, scatter plots — all in ASCII.', '{"Rust","crossterm","ratatui"}', 'published', 0, 345, 8900, 271, now() - interval '1 day', now() - interval '110 days')
ON CONFLICT DO NOTHING;

-- Nia Okafor
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000005', 'ModelPlayground', 'Test any open-source ML model in your browser. No GPU required.', '{"Python","FastAPI","WebAssembly","React"}', 'published', 0, 567, 18200, 385, now() - interval '7 hours', now() - interval '108 days'),
  ('a0000001-0000-0000-0000-000000000005', 'DataClean', 'Point it at any CSV and it fixes your data. Missing values, duplicates, type errors — gone.', '{"Python","Pandas","Claude API"}', 'published', 0, 234, 5600, 243, now() - interval '3 days', now() - interval '80 days')
ON CONFLICT DO NOTHING;

-- Marco Rossi
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000006', 'Budgetflow', 'The only budget app that learns your spending patterns and predicts your month.', '{"Swift","SwiftUI","CoreML","CloudKit"}', 'published', 0, 478, 14200, 326, now() - interval '12 hours', now() - interval '120 days'),
  ('a0000001-0000-0000-0000-000000000006', 'Scanly', 'Point your camera at any document. Instant OCR with smart field extraction.', '{"Swift","Vision","CoreML"}', 'active', 0, 312, 8900, 0, now() - interval '5 hours', now() - interval '60 days')
ON CONFLICT DO NOTHING;

-- Priya Krishnamurthy
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000007', 'QueueSmith', 'Dead simple job queue that scales to millions. Redis-backed, zero config.', '{"Go","Redis","Docker"}', 'published', 0, 723, 19800, 410, now() - interval '6 hours', now() - interval '150 days'),
  ('a0000001-0000-0000-0000-000000000007', 'MicroGate', 'API gateway in 200 lines of Go. Rate limiting, auth, and logging out of the box.', '{"Go","net/http","SQLite"}', 'published', 0, 189, 3200, 198, now() - interval '2 days', now() - interval '90 days')
ON CONFLICT DO NOTHING;

-- Dante Williams
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000008', 'GenerativeGarden', 'Plant seeds of code, watch generative art grow. Each piece is unique and animated.', '{"Three.js","WebGL","Claude API"}', 'published', 0, 389, 11200, 256, now() - interval '10 hours', now() - interval '102 days'),
  ('a0000001-0000-0000-0000-000000000008', 'SynthScape', 'AI-generated ambient soundscapes that evolve based on time of day and weather.', '{"Tone.js","Claude API","OpenWeather"}', 'published', 0, 256, 6800, 142, now() - interval '2 days', now() - interval '85 days'),
  ('a0000001-0000-0000-0000-000000000008', 'PixelMuse', 'Turn text descriptions into pixel art. Retro aesthetics meet modern AI.', '{"Canvas","Claude API","React"}', 'active', 0, 178, 4500, 0, now() - interval '8 hours', now() - interval '35 days')
ON CONFLICT DO NOTHING;

-- Elise Fontaine
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000009', 'FounderOS', 'All-in-one dashboard for solo founders. Metrics, tasks, finances, customers — one screen.', '{"Next.js","Supabase","Plaid","Stripe"}', 'published', 0, 734, 32000, 487, now() - interval '1 hour', now() - interval '165 days'),
  ('a0000001-0000-0000-0000-000000000009', 'PitchCraft', 'AI that writes your investor pitch deck. Just describe your startup in 3 sentences.', '{"Next.js","Claude API","PPTX"}', 'published', 0, 267, 7200, 354, now() - interval '4 hours', now() - interval '90 days')
ON CONFLICT DO NOTHING;

-- Kai Lindström
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000010', 'ShipFast', 'Next.js SaaS boilerplate with auth, payments, email, and SEO baked in. Ship in a weekend.', '{"Next.js","Stripe","Resend","Tailwind"}', 'published', 0, 567, 16800, 498, now() - interval '3 hours', now() - interval '135 days'),
  ('a0000001-0000-0000-0000-000000000010', 'CopyKit', 'AI copywriting assistant trained on high-converting landing pages. Paste your URL, get better copy.', '{"Next.js","Claude API","Cheerio"}', 'published', 0, 198, 4800, 167, now() - interval '1 day', now() - interval '80 days')
ON CONFLICT DO NOTHING;

-- Zara Ahmed
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000011', 'ChartCraft', 'Describe what you want to visualize in plain English. Get a production-ready D3 chart.', '{"D3.js","Claude API","React"}', 'published', 0, 345, 9800, 278, now() - interval '9 hours', now() - interval '90 days'),
  ('a0000001-0000-0000-0000-000000000011', 'DashBuilder', 'Drag-and-drop dashboard builder that connects to any API. No code needed.', '{"React","DnD Kit","REST"}', 'active', 0, 456, 13400, 0, now() - interval '4 hours', now() - interval '55 days')
ON CONFLICT DO NOTHING;

-- Tommy Nguyen
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000012', 'StudyPilot', 'AI study assistant that turns any textbook chapter into flashcards, quizzes, and summaries.', '{"React","Claude API","Supabase"}', 'published', 0, 234, 6200, 134, now() - interval '6 hours', now() - interval '72 days'),
  ('a0000001-0000-0000-0000-000000000012', 'ClassroomAI', 'Real-time AI tutor that adapts to your learning style. Built for students, by a student.', '{"Next.js","Claude API","WebRTC"}', 'active', 0, 189, 5100, 0, now() - interval '3 hours', now() - interval '30 days')
ON CONFLICT DO NOTHING;

-- Rosa Martinez
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000013', 'MedSchedule', 'Smart scheduling for medical practices. Reduces no-shows by 40% with AI reminders.', '{"Next.js","Twilio","Supabase","Claude API"}', 'published', 0, 678, 21000, 232, now() - interval '5 hours', now() - interval '140 days'),
  ('a0000001-0000-0000-0000-000000000013', 'PatientFlow', 'Waiting room management that actually works. Real-time queue updates via SMS.', '{"React","Twilio","Supabase"}', 'published', 0, 312, 8400, 156, now() - interval '1 day', now() - interval '100 days')
ON CONFLICT DO NOTHING;

-- Chris Olsen
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000014', 'GitFlow', 'Visual git branch manager. See your repo''s history as a beautiful interactive graph.', '{"Electron","D3.js","Node.js"}', 'published', 0, 512, 14800, 376, now() - interval '7 hours', now() - interval '112 days'),
  ('a0000001-0000-0000-0000-000000000014', 'TerminalTheme', 'AI-generated terminal themes based on your mood, music, or time of day.', '{"Rust","Claude API","crossterm"}', 'published', 0, 167, 4200, 145, now() - interval '2 days', now() - interval '78 days')
ON CONFLICT DO NOTHING;

-- Aisha Kamara
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000015', 'SendCash', 'Instant cross-border payments across Africa. Lower fees than Western Union.', '{"React Native","Node.js","Stellar SDK"}', 'published', 0, 834, 26000, 487, now() - interval '2 hours', now() - interval '162 days'),
  ('a0000001-0000-0000-0000-000000000015', 'MicroLend', 'P2P micro-lending platform with AI credit scoring. Banking the unbanked.', '{"Next.js","Python","Supabase"}', 'active', 0, 567, 18200, 0, now() - interval '4 hours', now() - interval '80 days')
ON CONFLICT DO NOTHING;

-- Leo Chen
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000016', 'QuestForge', 'AI dungeon master that creates unique storylines based on your play style.', '{"Unity","Claude API","C#"}', 'published', 0, 789, 24500, 398, now() - interval '3 hours', now() - interval '125 days'),
  ('a0000001-0000-0000-0000-000000000016', 'ProcGen', 'Procedural world generator for indie games. Infinite terrain, biomes, and structures.', '{"Rust","WebGPU","noise-rs"}', 'active', 0, 456, 13800, 0, now() - interval '6 hours', now() - interval '65 days')
ON CONFLICT DO NOTHING;

-- Fatima Al-Hassan
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000017', 'ArabiChat', 'Arabic-first AI chatbot with dialect understanding. Supports Gulf, Egyptian, and Levantine.', '{"Python","Claude API","FastAPI"}', 'published', 0, 345, 9200, 198, now() - interval '1 day', now() - interval '100 days'),
  ('a0000001-0000-0000-0000-000000000017', 'TranslateFlow', 'Real-time Arabic-English translation pipeline optimized for technical docs.', '{"Python","Transformers","FastAPI"}', 'stealth', 0, 123, 3400, 0, now() - interval '3 days', now() - interval '60 days')
ON CONFLICT DO NOTHING;

-- Ben Harper
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000018', 'StreamDeck', 'Analytics dashboard for content creators. See what works across YouTube, Twitch, TikTok.', '{"Next.js","YouTube API","Supabase"}', 'published', 0, 423, 12600, 365, now() - interval '8 hours', now() - interval '110 days'),
  ('a0000001-0000-0000-0000-000000000018', 'ClipAI', 'AI that watches your streams and auto-generates highlight clips. TikTok-ready.', '{"Python","FFmpeg","Claude API"}', 'published', 0, 289, 7800, 243, now() - interval '1 day', now() - interval '75 days')
ON CONFLICT DO NOTHING;

-- Nina Kowalski
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000019', 'A11yCheck', 'Paste any URL and get an instant accessibility audit with fix suggestions.', '{"Next.js","Puppeteer","Claude API"}', 'published', 0, 234, 6400, 210, now() - interval '2 days', now() - interval '78 days')
ON CONFLICT DO NOTHING;

-- Jake Oduya
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000020', 'StatsCast', 'Real-time sports analytics overlay for live broadcasts. See xG, heatmaps, pass networks.', '{"Python","OpenCV","React","WebSocket"}', 'published', 0, 678, 19800, 354, now() - interval '5 hours', now() - interval '147 days'),
  ('a0000001-0000-0000-0000-000000000020', 'FantasyAI', 'AI-powered fantasy football assistant. Optimal lineups based on 50+ data points.', '{"Python","Claude API","Next.js"}', 'published', 0, 345, 9200, 232, now() - interval '12 hours', now() - interval '95 days')
ON CONFLICT DO NOTHING;

-- Mia Sørensen
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000021', 'FocusFlow', 'Minimalist task manager that hides everything except what matters right now.', '{"Svelte","Supabase","Tailwind"}', 'published', 0, 189, 4800, 134, now() - interval '10 hours', now() - interval '82 days'),
  ('a0000001-0000-0000-0000-000000000021', 'WindDown', 'Evening routine app that gradually dims your screen and guides you to sleep.', '{"Swift","HealthKit","SwiftUI"}', 'active', 0, 134, 3600, 0, now() - interval '1 day', now() - interval '40 days')
ON CONFLICT DO NOTHING;

-- Ravi Patel
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000022', 'APIBridge', 'Connect any two APIs with a visual flow builder. Zapier but for developers.', '{"Node.js","React Flow","Redis"}', 'published', 0, 567, 16200, 376, now() - interval '4 hours', now() - interval '132 days'),
  ('a0000001-0000-0000-0000-000000000022', 'WebhookInspector', 'Debug webhooks in real time. See payloads, replay requests, catch errors instantly.', '{"Go","WebSocket","React"}', 'published', 0, 198, 4200, 187, now() - interval '2 days', now() - interval '85 days')
ON CONFLICT DO NOTHING;

-- Sophie Dubois
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000023', 'LessonForge', 'Teachers describe a topic, AI generates a full lesson plan with activities and assessments.', '{"Next.js","Claude API","Supabase"}', 'published', 0, 312, 8400, 256, now() - interval '7 hours', now() - interval '105 days'),
  ('a0000001-0000-0000-0000-000000000023', 'QuizWhiz', 'Upload any PDF or article. Get an instant quiz with difficulty scaling.', '{"React","Claude API","PDF.js"}', 'published', 0, 223, 5800, 198, now() - interval '1 day', now() - interval '70 days')
ON CONFLICT DO NOTHING;

-- Oscar Mendez
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000024', 'FlowBot', 'Visual automation builder for your terminal. Cron jobs, file watchers, API calls — all connected.', '{"Go","Bubble Tea","SQLite"}', 'published', 0, 456, 13200, 298, now() - interval '6 hours', now() - interval '120 days'),
  ('a0000001-0000-0000-0000-000000000024', 'ScriptVault', 'Searchable library of your shell scripts with AI-generated documentation.', '{"Rust","Claude API","SQLite"}', 'active', 0, 178, 4500, 0, now() - interval '3 hours', now() - interval '50 days')
ON CONFLICT DO NOTHING;

-- Lena Voss
INSERT INTO projects (user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at) VALUES
  ('a0000001-0000-0000-0000-000000000025', 'CreatorPay', 'Payment links designed for creators. Beautiful checkout, instant payouts, zero friction.', '{"Next.js","Stripe","Supabase"}', 'published', 0, 534, 15600, 365, now() - interval '2 hours', now() - interval '128 days'),
  ('a0000001-0000-0000-0000-000000000025', 'LinkBio', 'AI-generated link-in-bio pages that actually convert. Paste your socials, get a stunning page.', '{"Next.js","Claude API","Tailwind"}', 'published', 0, 267, 7200, 243, now() - interval '9 hours', now() - interval '85 days')
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════
-- BLOCK 3: FOLLOWS
-- ═══════════════════════════════════════

INSERT INTO follows (follower_id, following_id) VALUES
  -- jordanm followers (12)
  ('a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000003'),
  ('a0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000003'),
  ('a0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000003'),
  ('a0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000003'),
  ('a0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000003'),
  ('a0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000003'),
  ('a0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000003'),
  ('a0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000003'),
  ('a0000001-0000-0000-0000-000000000015', 'a0000001-0000-0000-0000-000000000003'),
  ('a0000001-0000-0000-0000-000000000016', 'a0000001-0000-0000-0000-000000000003'),
  ('a0000001-0000-0000-0000-000000000020', 'a0000001-0000-0000-0000-000000000003'),
  ('a0000001-0000-0000-0000-000000000025', 'a0000001-0000-0000-0000-000000000003'),
  -- elisef followers (10)
  ('a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000013', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000017', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000021', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000024', 'a0000001-0000-0000-0000-000000000009'),
  -- aishak followers (9)
  ('a0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000015'),
  ('a0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000015'),
  ('a0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000015'),
  ('a0000001-0000-0000-0000-000000000013', 'a0000001-0000-0000-0000-000000000015'),
  ('a0000001-0000-0000-0000-000000000017', 'a0000001-0000-0000-0000-000000000015'),
  ('a0000001-0000-0000-0000-000000000020', 'a0000001-0000-0000-0000-000000000015'),
  ('a0000001-0000-0000-0000-000000000022', 'a0000001-0000-0000-0000-000000000015'),
  ('a0000001-0000-0000-0000-000000000024', 'a0000001-0000-0000-0000-000000000015'),
  ('a0000001-0000-0000-0000-000000000014', 'a0000001-0000-0000-0000-000000000015'),
  -- samip followers (8)
  ('a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002'),
  ('a0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000002'),
  ('a0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000002'),
  ('a0000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000002'),
  ('a0000001-0000-0000-0000-000000000014', 'a0000001-0000-0000-0000-000000000002'),
  ('a0000001-0000-0000-0000-000000000016', 'a0000001-0000-0000-0000-000000000002'),
  ('a0000001-0000-0000-0000-000000000019', 'a0000001-0000-0000-0000-000000000002'),
  ('a0000001-0000-0000-0000-000000000021', 'a0000001-0000-0000-0000-000000000002'),
  -- leoc followers (7)
  ('a0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000016'),
  ('a0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000016'),
  ('a0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000016'),
  ('a0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000016'),
  ('a0000001-0000-0000-0000-000000000018', 'a0000001-0000-0000-0000-000000000016'),
  ('a0000001-0000-0000-0000-000000000020', 'a0000001-0000-0000-0000-000000000016'),
  ('a0000001-0000-0000-0000-000000000024', 'a0000001-0000-0000-0000-000000000016'),
  -- niao followers (7)
  ('a0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000005'),
  ('a0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000005'),
  ('a0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000005'),
  ('a0000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000005'),
  ('a0000001-0000-0000-0000-000000000013', 'a0000001-0000-0000-0000-000000000005'),
  ('a0000001-0000-0000-0000-000000000017', 'a0000001-0000-0000-0000-000000000005'),
  ('a0000001-0000-0000-0000-000000000022', 'a0000001-0000-0000-0000-000000000005'),
  -- keller's followers (8 seed users follow keller)
  ('a0000001-0000-0000-0000-000000000001', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000003', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000005', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000009', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000012', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000015', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000020', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000025', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  -- keller follows 6 seed users
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000003'),
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000002'),
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000009'),
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000015'),
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000016'),
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;
