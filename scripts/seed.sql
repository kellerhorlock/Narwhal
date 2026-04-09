-- ═══════════════════════════════════════════════════════════════
-- Narwhal Platform — Seed Data
-- 25 profiles, 58 projects, ~58 follows
-- Tokens are calculated live by frontend: commits * 25000
-- All token fields are 0.
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════
-- CLEANUP: Remove previous seed data
-- ═══════════════════════════════════════

DELETE FROM follows WHERE
  follower_id IN (
    'a0000001-0000-0000-0000-000000000001','a0000001-0000-0000-0000-000000000002','a0000001-0000-0000-0000-000000000003',
    'a0000001-0000-0000-0000-000000000004','a0000001-0000-0000-0000-000000000005','a0000001-0000-0000-0000-000000000006',
    'a0000001-0000-0000-0000-000000000007','a0000001-0000-0000-0000-000000000008','a0000001-0000-0000-0000-000000000009',
    'a0000001-0000-0000-0000-000000000010','a0000001-0000-0000-0000-000000000011','a0000001-0000-0000-0000-000000000012',
    'a0000001-0000-0000-0000-000000000013','a0000001-0000-0000-0000-000000000014','a0000001-0000-0000-0000-000000000015',
    'a0000001-0000-0000-0000-000000000016','a0000001-0000-0000-0000-000000000017','a0000001-0000-0000-0000-000000000018',
    'a0000001-0000-0000-0000-000000000019','a0000001-0000-0000-0000-000000000020','a0000001-0000-0000-0000-000000000021',
    'a0000001-0000-0000-0000-000000000022','a0000001-0000-0000-0000-000000000023','a0000001-0000-0000-0000-000000000024',
    'a0000001-0000-0000-0000-000000000025',
    'c2c85358-b3e4-4a84-9b5b-401d631eda11'
  )
  OR following_id IN (
    'a0000001-0000-0000-0000-000000000001','a0000001-0000-0000-0000-000000000002','a0000001-0000-0000-0000-000000000003',
    'a0000001-0000-0000-0000-000000000004','a0000001-0000-0000-0000-000000000005','a0000001-0000-0000-0000-000000000006',
    'a0000001-0000-0000-0000-000000000007','a0000001-0000-0000-0000-000000000008','a0000001-0000-0000-0000-000000000009',
    'a0000001-0000-0000-0000-000000000010','a0000001-0000-0000-0000-000000000011','a0000001-0000-0000-0000-000000000012',
    'a0000001-0000-0000-0000-000000000013','a0000001-0000-0000-0000-000000000014','a0000001-0000-0000-0000-000000000015',
    'a0000001-0000-0000-0000-000000000016','a0000001-0000-0000-0000-000000000017','a0000001-0000-0000-0000-000000000018',
    'a0000001-0000-0000-0000-000000000019','a0000001-0000-0000-0000-000000000020','a0000001-0000-0000-0000-000000000021',
    'a0000001-0000-0000-0000-000000000022','a0000001-0000-0000-0000-000000000023','a0000001-0000-0000-0000-000000000024',
    'a0000001-0000-0000-0000-000000000025',
    'c2c85358-b3e4-4a84-9b5b-401d631eda11'
  );

DELETE FROM projects WHERE user_id IN (
  'a0000001-0000-0000-0000-000000000001','a0000001-0000-0000-0000-000000000002','a0000001-0000-0000-0000-000000000003',
  'a0000001-0000-0000-0000-000000000004','a0000001-0000-0000-0000-000000000005','a0000001-0000-0000-0000-000000000006',
  'a0000001-0000-0000-0000-000000000007','a0000001-0000-0000-0000-000000000008','a0000001-0000-0000-0000-000000000009',
  'a0000001-0000-0000-0000-000000000010','a0000001-0000-0000-0000-000000000011','a0000001-0000-0000-0000-000000000012',
  'a0000001-0000-0000-0000-000000000013','a0000001-0000-0000-0000-000000000014','a0000001-0000-0000-0000-000000000015',
  'a0000001-0000-0000-0000-000000000016','a0000001-0000-0000-0000-000000000017','a0000001-0000-0000-0000-000000000018',
  'a0000001-0000-0000-0000-000000000019','a0000001-0000-0000-0000-000000000020','a0000001-0000-0000-0000-000000000021',
  'a0000001-0000-0000-0000-000000000022','a0000001-0000-0000-0000-000000000023','a0000001-0000-0000-0000-000000000024',
  'a0000001-0000-0000-0000-000000000025'
);

DELETE FROM profiles WHERE id IN (
  'a0000001-0000-0000-0000-000000000001','a0000001-0000-0000-0000-000000000002','a0000001-0000-0000-0000-000000000003',
  'a0000001-0000-0000-0000-000000000004','a0000001-0000-0000-0000-000000000005','a0000001-0000-0000-0000-000000000006',
  'a0000001-0000-0000-0000-000000000007','a0000001-0000-0000-0000-000000000008','a0000001-0000-0000-0000-000000000009',
  'a0000001-0000-0000-0000-000000000010','a0000001-0000-0000-0000-000000000011','a0000001-0000-0000-0000-000000000012',
  'a0000001-0000-0000-0000-000000000013','a0000001-0000-0000-0000-000000000014','a0000001-0000-0000-0000-000000000015',
  'a0000001-0000-0000-0000-000000000016','a0000001-0000-0000-0000-000000000017','a0000001-0000-0000-0000-000000000018',
  'a0000001-0000-0000-0000-000000000019','a0000001-0000-0000-0000-000000000020','a0000001-0000-0000-0000-000000000021',
  'a0000001-0000-0000-0000-000000000022','a0000001-0000-0000-0000-000000000023','a0000001-0000-0000-0000-000000000024',
  'a0000001-0000-0000-0000-000000000025'
);


-- ═══════════════════════════════════════
-- BLOCK 1: PROFILES (25)
-- ═══════════════════════════════════════

INSERT INTO profiles (id, username, display_name, bio, avatar_url, total_tokens_used, tokens_today, streak_days, hours_this_month, created_at, narwhal_api_key) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'luna_builds',      'Luna Chen',        'Full-stack dev obsessed with DX tooling. If your CLI has bad UX I will find you.',                  NULL, 0, 0, 34, 62, now() - interval '156 days', 'nk_a0000001-aaaa-4000-8000-000000000001'),
  ('a0000001-0000-0000-0000-000000000002', 'kai_ships',        'Kai Nakamura',     'Building the future of local-first apps. Offline-capable everything.',                               NULL, 0, 0, 41, 71, now() - interval '172 days', 'nk_a0000002-aaaa-4000-8000-000000000002'),
  ('a0000001-0000-0000-0000-000000000003', 'devraj',           'Raj Patel',        'ML engineer by day, indie hacker by night. Shipping models that actually work.',                     NULL, 0, 0, 18, 44, now() - interval '110 days', 'nk_a0000003-aaaa-4000-8000-000000000003'),
  ('a0000001-0000-0000-0000-000000000004', 'sara_codes',       'Sara Kim',         'Design engineer. Making beautiful things work. Figma to code in my sleep.',                           NULL, 0, 0, 27, 53, now() - interval '134 days', 'nk_a0000004-aaaa-4000-8000-000000000004'),
  ('a0000001-0000-0000-0000-000000000005', 'max_builds',       'Max Rivera',       'Rust evangelist. Systems programming enthusiast. Zero-cost abstractions or bust.',                    NULL, 0, 0, 45, 78, now() - interval '180 days', 'nk_a0000005-aaaa-4000-8000-000000000005'),
  ('a0000001-0000-0000-0000-000000000006', 'emi_dev',          'Emi Tanaka',       'Mobile-first everything. React Native expert. 4 apps in the App Store.',                             NULL, 0, 0, 12, 35, now() - interval '98 days',  'nk_a0000006-aaaa-4000-8000-000000000006'),
  ('a0000001-0000-0000-0000-000000000007', 'alex_the_builder', 'Alex Okafor',      'Backend infra nerd. Love distributed systems. Previously SRE at Cloudflare.',                       NULL, 0, 0, 38, 67, now() - interval '165 days', 'nk_a0000007-aaaa-4000-8000-000000000007'),
  ('a0000001-0000-0000-0000-000000000008', 'zoe_hacks',        'Zoe Williams',     'Security researcher turned builder. Finding vulns so you don''t have to.',                           NULL, 0, 0, 22, 48, now() - interval '125 days', 'nk_a0000008-aaaa-4000-8000-000000000008'),
  ('a0000001-0000-0000-0000-000000000009', 'noah_dev',         'Noah Bergstrom',   'Open source maintainer. TypeScript maximalist. 12k GitHub stars and counting.',                      NULL, 0, 0, 44, 80, now() - interval '178 days', 'nk_a0000009-aaaa-4000-8000-000000000009'),
  ('a0000001-0000-0000-0000-000000000010', 'priya_ships',      'Priya Sharma',     'Building tools for creators and artists. Art school dropout turned engineer.',                       NULL, 0, 0,  9, 28, now() - interval '82 days',  'nk_a0000010-aaaa-4000-8000-000000000010'),
  ('a0000001-0000-0000-0000-000000000011', 'jake_builds',      'Jake Thompson',    'Game dev meets web dev. Making the browser do things it shouldn''t.',                                NULL, 0, 0, 31, 59, now() - interval '148 days', 'nk_a0000011-aaaa-4000-8000-000000000011'),
  ('a0000001-0000-0000-0000-000000000012', 'mia_codes',        'Mia Rodriguez',    'Data viz enthusiast. D3.js addict. Turning messy data into stories.',                                NULL, 0, 0, 16, 41, now() - interval '105 days', 'nk_a0000012-aaaa-4000-8000-000000000012'),
  ('a0000001-0000-0000-0000-000000000013', 'omar_dev',         'Omar Hassan',      'Fintech builder. Making money move faster. Ex-Revolut.',                                             NULL, 0, 0, 36, 65, now() - interval '162 days', 'nk_a0000013-aaaa-4000-8000-000000000013'),
  ('a0000001-0000-0000-0000-000000000014', 'chloe_ships',      'Chloe Park',       'AI/ML + beautiful UIs. Why can''t ML dashboards look good?',                                         NULL, 0, 0, 25, 52, now() - interval '130 days', 'nk_a0000014-aaaa-4000-8000-000000000014'),
  ('a0000001-0000-0000-0000-000000000015', 'liam_hacks',       'Liam O''Brien',    'DevOps by trade, indie apps by passion. Terraform in the streets, React in the sheets.',            NULL, 0, 0, 19, 43, now() - interval '115 days', 'nk_a0000015-aaaa-4000-8000-000000000015'),
  ('a0000001-0000-0000-0000-000000000016', 'yuki_builds',      'Yuki Sato',        'AR/VR explorer. Pushing boundaries of spatial computing. Apple Vision Pro early adopter.',          NULL, 0, 0, 14, 37, now() - interval '102 days', 'nk_a0000016-aaaa-4000-8000-000000000016'),
  ('a0000001-0000-0000-0000-000000000017', 'dan_codes',        'Dan Mitchell',     'Former FAANG. Now building what I want. Life''s too short for Jira tickets.',                        NULL, 0, 0, 42, 74, now() - interval '170 days', 'nk_a0000017-aaaa-4000-8000-000000000017'),
  ('a0000001-0000-0000-0000-000000000018', 'nina_dev',         'Nina Volkov',      'Full-stack with a backend bias. Postgres is my love language.',                                      NULL, 0, 0, 30, 56, now() - interval '142 days', 'nk_a0000018-aaaa-4000-8000-000000000018'),
  ('a0000001-0000-0000-0000-000000000019', 'tyler_ships',      'Tyler James',      'CLI tools and terminal UIs. The terminal is the ultimate IDE.',                                      NULL, 0, 0, 23, 49, now() - interval '128 days', 'nk_a0000019-aaaa-4000-8000-000000000019'),
  ('a0000001-0000-0000-0000-000000000020', 'ava_builds',       'Ava Nguyen',       'Accessibility advocate. Inclusive design first. The web should work for everyone.',                   NULL, 0, 0,  7, 22, now() - interval '75 days',  'nk_a0000020-aaaa-4000-8000-000000000020'),
  ('a0000001-0000-0000-0000-000000000021', 'chris_dev',        'Chris Santos',     'Real-time everything. WebSocket wizard. If it doesn''t update live, is it even an app?',             NULL, 0, 0, 33, 61, now() - interval '152 days', 'nk_a0000021-aaaa-4000-8000-000000000021'),
  ('a0000001-0000-0000-0000-000000000022', 'mei_codes',        'Mei Li',           'Compiler nerd. Building language tools. Parsing is my cardio.',                                      NULL, 0, 0, 40, 72, now() - interval '168 days', 'nk_a0000022-aaaa-4000-8000-000000000022'),
  ('a0000001-0000-0000-0000-000000000023', 'ben_hacks',        'Ben Cooper',       'Blockchain skeptic building web3 tools anyway. Someone has to make them usable.',                    NULL, 0, 0, 11, 32, now() - interval '92 days',  'nk_a0000023-aaaa-4000-8000-000000000023'),
  ('a0000001-0000-0000-0000-000000000024', 'iris_ships',       'Iris Andersson',   'Swedish dev. Clean code, clean design. Minimalism is a feature, not a limitation.',                  NULL, 0, 0, 28, 55, now() - interval '138 days', 'nk_a0000024-aaaa-4000-8000-000000000024'),
  ('a0000001-0000-0000-0000-000000000025', 'ravi_builds',      'Ravi Kumar',       'IoT + embedded systems + cloud glue. Making hardware talk to software since 2015.',                  NULL, 0, 0, 20, 46, now() - interval '118 days', 'nk_a0000025-aaaa-4000-8000-000000000025')
ON CONFLICT (id) DO NOTHING;


-- ═══════════════════════════════════════
-- BLOCK 2: PROJECTS (58 total)
-- ═══════════════════════════════════════

-- luna_builds — DX tooling
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'devenv', 'One command to spin up a fully configured dev environment. Docker, secrets, ports, LSP — all wired. Like Nix but you don''t need a PhD.', '{"Rust","Docker","TOML"}', 'published', 0, 342, 18500, 487, now() - interval '3 hours', now() - interval '150 days', 'https://devenv.sh', 'https://github.com/luna-builds/devenv', NULL),
  ('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', 'hotreload', 'Universal hot-reload for any language. Watches files, infers build steps, restarts intelligently. Faster than nodemon, works with everything.', '{"Go","fsnotify","WebSocket"}', 'published', 0, 187, 8200, 312, now() - interval '1 day', now() - interval '95 days', NULL, 'https://github.com/luna-builds/hotreload', NULL),
  ('b0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001', 'pkgcheck', 'Audit your node_modules for bloat, duplicates, and abandoned deps. Saves 40% bundle size on average.', '{"TypeScript","Node.js","esbuild"}', 'active', 0, 89, 4100, 156, now() - interval '6 hours', now() - interval '42 days', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- kai_ships — Local-first apps
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000002', 'SyncEngine', 'Drop-in CRDT sync layer for any app. Works offline, resolves conflicts automatically. Replaces Firebase for apps that need to work on planes.', '{"TypeScript","Yjs","IndexedDB","WebRTC"}', 'published', 0, 567, 32000, 423, now() - interval '4 hours', now() - interval '168 days', 'https://syncengine.dev', 'https://github.com/kai-ships/sync-engine', NULL),
  ('b0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000002', 'LocalBase', 'SQLite in the browser with real-time reactive queries. Like Supabase but your data never leaves the device.', '{"TypeScript","SQLite","WASM","React"}', 'published', 0, 412, 24600, 289, now() - interval '8 hours', now() - interval '130 days', NULL, 'https://github.com/kai-ships/localbase', NULL)
ON CONFLICT (id) DO NOTHING;

-- devraj — ML + indie hacking
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000003', 'ModelDrop', 'Deploy any HuggingFace model as an API endpoint in 60 seconds. Auto-scaling, caching, rate limiting included.', '{"Python","FastAPI","Docker","Redis"}', 'published', 0, 234, 15800, 345, now() - interval '5 hours', now() - interval '105 days', 'https://modeldrop.ai', 'https://github.com/devraj/modeldrop', NULL),
  ('b0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000003', 'PromptBench', 'A/B test your prompts at scale. Side-by-side comparison, statistical significance, cost tracking. Stop guessing which prompt is better.', '{"Next.js","Python","Supabase","Claude API"}', 'active', 0, 156, 9200, 0, now() - interval '2 days', now() - interval '65 days', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- sara_codes — Design engineering
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000004', 'MotionKit', 'Production-ready animation primitives for React. Spring physics, gesture-driven transitions, layout animations. 60fps or your money back.', '{"React","Framer Motion","TypeScript"}', 'published', 0, 445, 26800, 498, now() - interval '2 hours', now() - interval '128 days', 'https://motionkit.design', 'https://github.com/sara-codes/motion-kit', NULL),
  ('b0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000004', 'FigSync', 'Bidirectional sync between Figma and your React component library. Change a color in Figma, see it in code instantly.', '{"TypeScript","Figma Plugin API","React"}', 'published', 0, 278, 14500, 267, now() - interval '1 day', now() - interval '90 days', NULL, 'https://github.com/sara-codes/figsync', NULL),
  ('b0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000004', 'Chromaflow', 'AI-powered color system generator. Describe your brand personality, get a complete design token palette with accessibility guarantees.', '{"Svelte","Claude API","TailwindCSS"}', 'stealth', 0, 112, 5400, 0, now() - interval '12 hours', now() - interval '38 days', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- max_builds — Rust / Systems
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000005', 'quickserve', 'Zero-config local dev server. 10x faster than anything Node-based. Hot reload, HTTPS, proxy — all built in. Written in Rust because speed matters.', '{"Rust","tokio","hyper","rustls"}', 'published', 0, 612, 38000, 467, now() - interval '3 hours', now() - interval '175 days', 'https://quickserve.dev', 'https://github.com/max-builds/quickserve', NULL),
  ('b0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000005', 'ripdb', 'Embedded key-value store that''s faster than SQLite for simple lookups. B-tree based, ACID compliant, single-file database.', '{"Rust","serde","mmap"}', 'published', 0, 789, 45000, 234, now() - interval '6 hours', now() - interval '160 days', NULL, 'https://github.com/max-builds/ripdb', NULL)
ON CONFLICT (id) DO NOTHING;

-- emi_dev — Mobile / React Native
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000013', 'a0000001-0000-0000-0000-000000000006', 'Glide', 'Cross-platform gesture library for React Native. Instagram-quality swipe interactions in 5 lines of code.', '{"React Native","Reanimated","TypeScript"}', 'published', 0, 198, 11200, 389, now() - interval '10 hours', now() - interval '92 days', NULL, 'https://github.com/emi-dev/glide', NULL),
  ('b0000001-0000-0000-0000-000000000014', 'a0000001-0000-0000-0000-000000000006', 'AppShell', 'Opinionated React Native starter with auth, navigation, theming, and push notifications pre-wired. Skip 2 weeks of boilerplate.', '{"React Native","Expo","Supabase","Zustand"}', 'published', 0, 324, 19800, 256, now() - interval '2 days', now() - interval '78 days', 'https://appshell.dev', 'https://github.com/emi-dev/appshell', NULL)
ON CONFLICT (id) DO NOTHING;

-- alex_the_builder — Backend infra
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000015', 'a0000001-0000-0000-0000-000000000007', 'QueueSmith', 'Dead simple job queue that scales to millions. Redis-backed with delayed jobs, retries, dead letter queues. Config in 3 lines.', '{"Go","Redis","Docker","Prometheus"}', 'published', 0, 723, 42000, 412, now() - interval '2 hours', now() - interval '160 days', 'https://queuesmith.io', 'https://github.com/alex-the-builder/queuesmith', NULL),
  ('b0000001-0000-0000-0000-000000000016', 'a0000001-0000-0000-0000-000000000007', 'LoadForge', 'Load testing tool that generates realistic traffic patterns from your access logs. Not synthetic garbage — real user behavior.', '{"Go","eBPF","Grafana"}', 'published', 0, 456, 28600, 178, now() - interval '1 day', now() - interval '120 days', NULL, 'https://github.com/alex-the-builder/loadforge', NULL)
ON CONFLICT (id) DO NOTHING;

-- zoe_hacks — Security
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000017', 'a0000001-0000-0000-0000-000000000008', 'VaultGuard', 'Secrets manager for indie devs. Encrypted at rest, team sharing, CLI-first. Like 1Password for your .env files.', '{"Rust","AES-256","SQLite","CLI"}', 'published', 0, 287, 16400, 356, now() - interval '5 hours', now() - interval '120 days', 'https://vaultguard.dev', 'https://github.com/zoe-hacks/vaultguard', NULL),
  ('b0000001-0000-0000-0000-000000000018', 'a0000001-0000-0000-0000-000000000008', 'ScanQL', 'Static analysis for SQL injection vulnerabilities. Scans your ORM queries and raw SQL. Catches what ESLint can''t.', '{"TypeScript","Tree-sitter","Node.js"}', 'published', 0, 198, 10800, 201, now() - interval '3 days', now() - interval '88 days', NULL, 'https://github.com/zoe-hacks/scanql', NULL)
ON CONFLICT (id) DO NOTHING;

-- noah_dev — Open source / TypeScript
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000019', 'a0000001-0000-0000-0000-000000000009', 'TypeForge', 'Runtime type validation that generates from your TypeScript types. Zero duplication between your types and your validators.', '{"TypeScript","ts-morph","Zod"}', 'published', 0, 534, 31200, 489, now() - interval '1 hour', now() - interval '172 days', 'https://typeforge.dev', 'https://github.com/noah-dev/typeforge', NULL),
  ('b0000001-0000-0000-0000-000000000020', 'a0000001-0000-0000-0000-000000000009', 'ts-assert', 'Compile-time assertion library for TypeScript. Catch impossible states before they happen. Type-level unit tests.', '{"TypeScript"}', 'published', 0, 267, 12400, 378, now() - interval '8 hours', now() - interval '140 days', NULL, 'https://github.com/noah-dev/ts-assert', NULL),
  ('b0000001-0000-0000-0000-000000000021', 'a0000001-0000-0000-0000-000000000009', 'effect-router', 'Type-safe HTTP router built on Effect-TS. Full type inference from URL params to response body. Zero any types.', '{"TypeScript","Effect-TS","Node.js"}', 'active', 0, 145, 7800, 0, now() - interval '4 hours', now() - interval '55 days', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- priya_ships — Creator tools
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000022', 'a0000001-0000-0000-0000-000000000010', 'CanvasAI', 'Describe what you want to draw, get a step-by-step tutorial with interactive canvas. Art education meets generative AI.', '{"Next.js","Canvas API","Claude API","Supabase"}', 'published', 0, 178, 9800, 234, now() - interval '7 hours', now() - interval '76 days', 'https://canvasai.art', NULL, NULL),
  ('b0000001-0000-0000-0000-000000000023', 'a0000001-0000-0000-0000-000000000010', 'PaletteGen', 'AI color palette generator trained on 100k+ design award winners. Understands mood, industry, and accessibility constraints.', '{"React","TailwindCSS","Claude API"}', 'published', 0, 134, 6200, 189, now() - interval '2 days', now() - interval '58 days', NULL, 'https://github.com/priya-ships/palettegen', NULL)
ON CONFLICT (id) DO NOTHING;

-- jake_builds — Game dev + web
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000024', 'a0000001-0000-0000-0000-000000000011', 'BrowserQuest', 'Multiplayer RPG engine that runs entirely in the browser. WebGPU rendering, WebRTC netcode, ECS architecture.', '{"TypeScript","WebGPU","WebRTC","bitECS"}', 'published', 0, 678, 48000, 345, now() - interval '2 hours', now() - interval '142 days', 'https://browserquest.gg', 'https://github.com/jake-builds/browserquest', NULL),
  ('b0000001-0000-0000-0000-000000000025', 'a0000001-0000-0000-0000-000000000011', 'SpriteForge', 'AI sprite sheet generator. Describe a character, get walk cycles, attack animations, idle poses — all pixel-perfect and game-ready.', '{"Python","Stable Diffusion","Canvas API","React"}', 'active', 0, 234, 13600, 0, now() - interval '6 hours', now() - interval '68 days', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- mia_codes — Data viz
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000026', 'a0000001-0000-0000-0000-000000000012', 'ChartCraft', 'Describe your data story in plain English. Get a production-ready D3 visualization with animations and responsive layout.', '{"D3.js","Claude API","React","TypeScript"}', 'published', 0, 345, 19200, 378, now() - interval '9 hours', now() - interval '100 days', 'https://chartcraft.dev', 'https://github.com/mia-codes/chartcraft', NULL),
  ('b0000001-0000-0000-0000-000000000027', 'a0000001-0000-0000-0000-000000000012', 'DataCanvas', 'Infinite canvas for exploring datasets. Zoom from overview to individual records. Spatial data exploration like you''ve never seen.', '{"React","Canvas API","DuckDB-WASM"}', 'published', 0, 289, 16800, 201, now() - interval '1 day', now() - interval '75 days', NULL, 'https://github.com/mia-codes/datacanvas', NULL)
ON CONFLICT (id) DO NOTHING;

-- omar_dev — Fintech
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000028', 'a0000001-0000-0000-0000-000000000013', 'LedgerKit', 'Double-entry accounting engine for fintech apps. Immutable ledger, multi-currency, real-time balance queries. Stripe-level reliability for your startup.', '{"Go","PostgreSQL","gRPC","Docker"}', 'published', 0, 567, 34200, 267, now() - interval '3 hours', now() - interval '158 days', 'https://ledgerkit.io', 'https://github.com/omar-dev/ledgerkit', NULL),
  ('b0000001-0000-0000-0000-000000000029', 'a0000001-0000-0000-0000-000000000013', 'PayRoute', 'Smart payment routing that finds the cheapest path across payment processors. Saves 15-30% on processing fees.', '{"Node.js","Stripe","Adyen","PostgreSQL"}', 'stealth', 0, 312, 18400, 0, now() - interval '5 hours', now() - interval '95 days', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- chloe_ships — AI/ML + design
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000030', 'a0000001-0000-0000-0000-000000000014', 'ModelView', 'Beautiful real-time dashboards for ML training runs. Loss curves, attention maps, embedding visualizations. Makes W&B look boring.', '{"Next.js","D3.js","WebSocket","Python"}', 'published', 0, 423, 25600, 312, now() - interval '4 hours', now() - interval '125 days', 'https://modelview.ai', 'https://github.com/chloe-ships/modelview', NULL),
  ('b0000001-0000-0000-0000-000000000031', 'a0000001-0000-0000-0000-000000000014', 'PromptStudio', 'Visual IDE for prompt engineering. Version control, A/B testing, cost estimation. Like Figma but for LLM prompts.', '{"React","Monaco Editor","Claude API","Supabase"}', 'published', 0, 267, 14200, 245, now() - interval '12 hours', now() - interval '85 days', NULL, 'https://github.com/chloe-ships/prompt-studio', NULL)
ON CONFLICT (id) DO NOTHING;

-- liam_hacks — DevOps + indie
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000032', 'a0000001-0000-0000-0000-000000000015', 'InfraCost', 'Predict your AWS bill before you deploy. Parses your Terraform and gives you a cost breakdown with optimization suggestions.', '{"Go","Terraform","HCL","AWS SDK"}', 'published', 0, 345, 21000, 289, now() - interval '6 hours', now() - interval '110 days', 'https://infracost.sh', 'https://github.com/liam-hacks/infracost', NULL),
  ('b0000001-0000-0000-0000-000000000033', 'a0000001-0000-0000-0000-000000000015', 'DeployBot', 'ChatOps deployment bot. Type /deploy staging in Slack and watch it happen. Rollbacks, approvals, audit log built in.', '{"Node.js","Slack API","Docker","GitHub Actions"}', 'published', 0, 198, 11800, 167, now() - interval '2 days', now() - interval '78 days', NULL, 'https://github.com/liam-hacks/deploybot', NULL)
ON CONFLICT (id) DO NOTHING;

-- yuki_builds — AR/VR / Spatial
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000034', 'a0000001-0000-0000-0000-000000000016', 'SpatialUI', 'Component library for visionOS. Buttons, modals, lists — all designed for spatial interaction with proper depth and parallax.', '{"Swift","SwiftUI","RealityKit","visionOS"}', 'published', 0, 234, 14800, 178, now() - interval '8 hours', now() - interval '96 days', 'https://spatialui.dev', NULL, NULL),
  ('b0000001-0000-0000-0000-000000000035', 'a0000001-0000-0000-0000-000000000016', 'RoomScan', 'Scan any room with your iPhone, get a 3D model you can import into Unity or Blender. LiDAR-powered, millimeter accurate.', '{"Swift","ARKit","SceneKit","USDZ"}', 'active', 0, 156, 8600, 0, now() - interval '1 day', now() - interval '52 days', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- dan_codes — Ex-FAANG indie
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000036', 'a0000001-0000-0000-0000-000000000017', 'LaunchStack', 'The fastest way to go from idea to deployed SaaS. Auth, payments, email, dashboard — production-ready in an afternoon. Used by 300+ indie hackers.', '{"Next.js","Supabase","Stripe","Resend","TailwindCSS"}', 'published', 0, 800, 49000, 456, now() - interval '1 hour', now() - interval '165 days', 'https://launchstack.dev', 'https://github.com/dan-codes/launchstack', NULL),
  ('b0000001-0000-0000-0000-000000000037', 'a0000001-0000-0000-0000-000000000017', 'FeedbackFly', 'Embeddable feedback widget that uses AI to categorize, deduplicate, and prioritize user feedback. Never lose a feature request again.', '{"React","Claude API","Supabase","TypeScript"}', 'published', 0, 234, 12800, 312, now() - interval '5 hours', now() - interval '105 days', 'https://feedbackfly.io', 'https://github.com/dan-codes/feedbackfly', NULL)
ON CONFLICT (id) DO NOTHING;

-- nina_dev — Backend-heavy full-stack
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000038', 'a0000001-0000-0000-0000-000000000018', 'PgPipe', 'Real-time data pipeline from PostgreSQL to anywhere. CDC-based, exactly-once delivery. Replaces Debezium for 90% of use cases.', '{"Rust","PostgreSQL","Kafka","Protobuf"}', 'published', 0, 456, 28800, 234, now() - interval '3 hours', now() - interval '138 days', 'https://pgpipe.dev', 'https://github.com/nina-dev/pgpipe', NULL),
  ('b0000001-0000-0000-0000-000000000039', 'a0000001-0000-0000-0000-000000000018', 'MigrateCI', 'Run database migrations in CI with automatic rollback on failure. Schema diffing, seed data validation, zero-downtime deploys.', '{"TypeScript","PostgreSQL","GitHub Actions"}', 'published', 0, 189, 9600, 178, now() - interval '2 days', now() - interval '92 days', NULL, 'https://github.com/nina-dev/migrateci', NULL)
ON CONFLICT (id) DO NOTHING;

-- tyler_ships — CLI / Terminal
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000040', 'a0000001-0000-0000-0000-000000000019', 'tui-dash', 'Full-featured dashboard framework for the terminal. Charts, tables, logs — all rendered in beautiful ASCII with mouse support.', '{"Rust","ratatui","crossterm","tokio"}', 'published', 0, 389, 22400, 345, now() - interval '4 hours', now() - interval '122 days', NULL, 'https://github.com/tyler-ships/tui-dash', NULL),
  ('b0000001-0000-0000-0000-000000000041', 'a0000001-0000-0000-0000-000000000019', 'aiterm', 'AI-powered terminal that suggests commands as you type. Understands your project context, reads your README, knows your aliases.', '{"Rust","Claude API","tree-sitter"}', 'published', 0, 267, 15200, 423, now() - interval '7 hours', now() - interval '95 days', 'https://aiterm.dev', 'https://github.com/tyler-ships/aiterm', NULL)
ON CONFLICT (id) DO NOTHING;

-- ava_builds — Accessibility
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000042', 'a0000001-0000-0000-0000-000000000020', 'A11yKit', 'Accessible React component library with built-in screen reader testing. Every component ships with ARIA attributes and keyboard navigation.', '{"React","TypeScript","Radix UI","TailwindCSS"}', 'published', 0, 156, 8400, 267, now() - interval '10 hours', now() - interval '70 days', 'https://a11ykit.dev', 'https://github.com/ava-builds/a11ykit', NULL),
  ('b0000001-0000-0000-0000-000000000043', 'a0000001-0000-0000-0000-000000000020', 'ContrastCheck', 'Browser extension that overlays WCAG contrast ratios on any website. Real-time, works on dynamic content, exports audit reports.', '{"TypeScript","Chrome Extension API","Canvas"}', 'published', 0, 89, 3800, 189, now() - interval '3 days', now() - interval '48 days', NULL, 'https://github.com/ava-builds/contrast-check', NULL)
ON CONFLICT (id) DO NOTHING;

-- chris_dev — Real-time / WebSocket
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000044', 'a0000001-0000-0000-0000-000000000021', 'LiveState', 'Server-driven UI state over WebSockets. Like Phoenix LiveView but for any backend. Real-time apps without the client complexity.', '{"TypeScript","WebSocket","React","Node.js"}', 'published', 0, 534, 32800, 356, now() - interval '2 hours', now() - interval '148 days', 'https://livestate.dev', 'https://github.com/chris-dev/livestate', NULL),
  ('b0000001-0000-0000-0000-000000000045', 'a0000001-0000-0000-0000-000000000021', 'PubSub.js', 'Lightweight pub/sub for the browser with channel presence, typing indicators, and cursor sharing. Multiplayer anything in 10 lines.', '{"TypeScript","WebSocket","Redis"}', 'published', 0, 234, 13200, 289, now() - interval '8 hours', now() - interval '105 days', NULL, 'https://github.com/chris-dev/pubsubjs', NULL)
ON CONFLICT (id) DO NOTHING;

-- mei_codes — Compilers / Language tools
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000046', 'a0000001-0000-0000-0000-000000000022', 'MiniLang', 'Tiny programming language that compiles to WASM. Pattern matching, algebraic types, no null. Perfect for teaching compiler design.', '{"Rust","WASM","LLVM"}', 'published', 0, 678, 41000, 198, now() - interval '5 hours', now() - interval '162 days', 'https://minilang.dev', 'https://github.com/mei-codes/minilang', NULL),
  ('b0000001-0000-0000-0000-000000000047', 'a0000001-0000-0000-0000-000000000022', 'LSP-Gen', 'Generate a Language Server Protocol implementation from a grammar file. Syntax highlighting, autocomplete, diagnostics — all generated.', '{"Rust","Tree-sitter","LSP"}', 'published', 0, 345, 22600, 156, now() - interval '1 day', now() - interval '120 days', NULL, 'https://github.com/mei-codes/lsp-gen', NULL),
  ('b0000001-0000-0000-0000-000000000048', 'a0000001-0000-0000-0000-000000000022', 'ParseViz', 'Interactive AST visualizer. Paste code in any language, see the parse tree animate in real time. Great for learning and debugging grammars.', '{"React","Tree-sitter-WASM","D3.js"}', 'active', 0, 112, 5600, 0, now() - interval '3 hours', now() - interval '45 days', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- ben_hacks — Web3 tools (skeptic)
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000049', 'a0000001-0000-0000-0000-000000000023', 'WalletKit', 'The least annoying crypto wallet integration. One component, all major wallets, works first try. Because connecting a wallet shouldn''t require a PhD.', '{"TypeScript","ethers.js","React","WalletConnect"}', 'published', 0, 234, 13800, 312, now() - interval '6 hours', now() - interval '88 days', 'https://walletkit.dev', 'https://github.com/ben-hacks/walletkit', NULL),
  ('b0000001-0000-0000-0000-000000000050', 'a0000001-0000-0000-0000-000000000023', 'GasWatch', 'Real-time gas price tracker with predictions and transaction cost estimator. Saves your users from overpaying on gas fees.', '{"Next.js","ethers.js","WebSocket","Chart.js"}', 'published', 0, 156, 7200, 178, now() - interval '2 days', now() - interval '62 days', NULL, 'https://github.com/ben-hacks/gaswatch', NULL)
ON CONFLICT (id) DO NOTHING;

-- iris_ships — Clean code / Minimalism
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000051', 'a0000001-0000-0000-0000-000000000024', 'Zen UI', 'Minimal React component library. 12 components, 4KB total. No dependencies, no bloat. Every pixel intentional.', '{"React","TypeScript","CSS Modules"}', 'published', 0, 312, 16200, 389, now() - interval '3 hours', now() - interval '132 days', 'https://zenui.design', 'https://github.com/iris-ships/zen-ui', NULL),
  ('b0000001-0000-0000-0000-000000000052', 'a0000001-0000-0000-0000-000000000024', 'Brevity', 'URL shortener with analytics, custom domains, and link previews. Self-hostable, privacy-first, beautifully simple.', '{"SvelteKit","PostgreSQL","Cloudflare Workers"}', 'published', 0, 198, 10400, 234, now() - interval '1 day', now() - interval '98 days', 'https://brevity.link', 'https://github.com/iris-ships/brevity', NULL),
  ('b0000001-0000-0000-0000-000000000053', 'a0000001-0000-0000-0000-000000000024', 'DotFiles', 'Opinionated dotfile manager with encrypted secrets sync across machines. Your dev environment, anywhere, in 60 seconds.', '{"Rust","TOML","AES-256"}', 'stealth', 0, 87, 3200, 0, now() - interval '12 hours', now() - interval '35 days', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- ravi_builds — IoT + Embedded
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000054', 'a0000001-0000-0000-0000-000000000025', 'ThingBridge', 'MQTT-to-REST bridge for IoT devices. Your sensors speak MQTT, your app speaks REST. This translates in real time with buffering and retry.', '{"Rust","MQTT","tokio","Redis"}', 'published', 0, 345, 20800, 198, now() - interval '4 hours', now() - interval '112 days', 'https://thingbridge.io', 'https://github.com/ravi-builds/thingbridge', NULL),
  ('b0000001-0000-0000-0000-000000000055', 'a0000001-0000-0000-0000-000000000025', 'FlashOTA', 'Over-the-air firmware updates for ESP32 and Arduino. Rollbacks, A/B partitions, signed updates. Production IoT without the pain.', '{"C++","Rust","AWS IoT","MQTT"}', 'published', 0, 456, 26400, 145, now() - interval '1 day', now() - interval '88 days', NULL, 'https://github.com/ravi-builds/flashota', NULL),
  ('b0000001-0000-0000-0000-000000000056', 'a0000001-0000-0000-0000-000000000025', 'SensorDash', 'Real-time dashboard for IoT sensor networks. Plug in your MQTT broker, get instant time-series charts and alerting.', '{"Next.js","InfluxDB","MQTT.js","Chart.js"}', 'active', 0, 178, 9200, 0, now() - interval '6 hours', now() - interval '52 days', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Bonus projects to reach 58
INSERT INTO projects (id, user_id, name, description, tech_stack, status, tokens_used, commits, lines_changed, downloads, last_activity, created_at, landing_url, download_url, thumbnail_url) VALUES
  ('b0000001-0000-0000-0000-000000000057', 'a0000001-0000-0000-0000-000000000003', 'EvalHarness', 'Standardized evaluation framework for LLM applications. Define test cases in YAML, run against any model, get pass rates and latency stats.', '{"Python","Claude API","YAML","pytest"}', 'published', 0, 189, 11400, 156, now() - interval '1 day', now() - interval '72 days', NULL, 'https://github.com/devraj/eval-harness', NULL),
  ('b0000001-0000-0000-0000-000000000058', 'a0000001-0000-0000-0000-000000000013', 'SplitWise API', 'Open-source expense splitting engine with multi-currency support and optimal debt simplification. The math behind Splitwise, as a library.', '{"TypeScript","PostgreSQL","Node.js"}', 'published', 0, 267, 15600, 201, now() - interval '3 hours', now() - interval '110 days', NULL, 'https://github.com/omar-dev/splitwise-api', NULL)
ON CONFLICT (id) DO NOTHING;


-- ═══════════════════════════════════════
-- BLOCK 3: FOLLOWS (~58 relationships)
-- Includes keller's real profile: c2c85358-b3e4-4a84-9b5b-401d631eda11
-- ═══════════════════════════════════════

INSERT INTO follows (follower_id, following_id) VALUES
  -- Seed users following keller (10 followers)
  ('a0000001-0000-0000-0000-000000000001', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000002', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000005', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000009', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000011', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000014', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000017', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000019', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000022', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),
  ('a0000001-0000-0000-0000-000000000024', 'c2c85358-b3e4-4a84-9b5b-401d631eda11'),

  -- Keller following seed users (8)
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000002'),
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000005'),
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000007'),
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000009'),
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000017'),
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000021'),
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000022'),
  ('c2c85358-b3e4-4a84-9b5b-401d631eda11', 'a0000001-0000-0000-0000-000000000024'),

  -- noah_dev followers (popular — TypeScript king)
  ('a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000017', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000018', 'a0000001-0000-0000-0000-000000000009'),
  ('a0000001-0000-0000-0000-000000000021', 'a0000001-0000-0000-0000-000000000009'),

  -- dan_codes followers (popular — LaunchStack creator)
  ('a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000017'),
  ('a0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000017'),
  ('a0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000017'),
  ('a0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000017'),
  ('a0000001-0000-0000-0000-000000000015', 'a0000001-0000-0000-0000-000000000017'),
  ('a0000001-0000-0000-0000-000000000023', 'a0000001-0000-0000-0000-000000000017'),

  -- kai_ships followers (local-first pioneer)
  ('a0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000002'),
  ('a0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000002'),
  ('a0000001-0000-0000-0000-000000000018', 'a0000001-0000-0000-0000-000000000002'),
  ('a0000001-0000-0000-0000-000000000021', 'a0000001-0000-0000-0000-000000000002'),

  -- max_builds followers (Rust community)
  ('a0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000005'),
  ('a0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000005'),
  ('a0000001-0000-0000-0000-000000000019', 'a0000001-0000-0000-0000-000000000005'),
  ('a0000001-0000-0000-0000-000000000022', 'a0000001-0000-0000-0000-000000000005'),

  -- mei_codes followers (compiler nerds)
  ('a0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000022'),
  ('a0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000022'),
  ('a0000001-0000-0000-0000-000000000019', 'a0000001-0000-0000-0000-000000000022'),

  -- alex_the_builder followers (infra heads)
  ('a0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000007'),
  ('a0000001-0000-0000-0000-000000000015', 'a0000001-0000-0000-0000-000000000007'),
  ('a0000001-0000-0000-0000-000000000018', 'a0000001-0000-0000-0000-000000000007'),

  -- omar_dev followers (fintech)
  ('a0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000013'),
  ('a0000001-0000-0000-0000-000000000023', 'a0000001-0000-0000-0000-000000000013'),

  -- Cross-community follows (organic connections)
  ('a0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000012'),  -- sara follows mia (design + viz)
  ('a0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000014'),  -- mia follows chloe (viz + ML viz)
  ('a0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000004'),  -- emi follows sara (mobile + design)
  ('a0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000004'),  -- priya follows sara (creator + design)
  ('a0000001-0000-0000-0000-000000000020', 'a0000001-0000-0000-0000-000000000004'),  -- ava follows sara (a11y + design)
  ('a0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000007'),  -- zoe follows alex (security + infra)
  ('a0000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000016'),  -- jake follows yuki (games + spatial)
  ('a0000001-0000-0000-0000-000000000016', 'a0000001-0000-0000-0000-000000000011'),  -- yuki follows jake (spatial + games)
  ('a0000001-0000-0000-0000-000000000025', 'a0000001-0000-0000-0000-000000000021'),  -- ravi follows chris (IoT + real-time)
  ('a0000001-0000-0000-0000-000000000024', 'a0000001-0000-0000-0000-000000000020')   -- iris follows ava (clean design + a11y)
ON CONFLICT DO NOTHING;
