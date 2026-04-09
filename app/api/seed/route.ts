import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const SEED_KEY = "narwhal-seed-2026";

interface ProfileSeed {
  display_name: string;
  username: string;
  bio: string;
  projects: ProjectSeed[];
}

interface ProjectSeed {
  name: string;
  description: string;
  tech_stack: string[];
  commits: number;
  lines_changed: number;
  tokens_used: number;
  status: "published" | "active" | "stealth";
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateAgo(minDays: number, maxDays: number): string {
  const days = randomBetween(minDays, maxDays);
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return d.toISOString();
}

function randomRecentDate(): string {
  // Between 1 hour and 14 days ago
  const hours = randomBetween(1, 14 * 24);
  const d = new Date(Date.now() - hours * 60 * 60 * 1000);
  return d.toISOString();
}

const PROFILES: ProfileSeed[] = [
  {
    display_name: "Alex Reeves", username: "alexr",
    bio: "Ex-Stripe engineer. Now building indie tools with Claude. San Francisco.",
    projects: [
      { name: "PayKit", description: "Drop-in payment components for indie hackers. Stripe integration in 3 lines of code.", tech_stack: ["React", "Stripe API", "TypeScript"], commits: 234, lines_changed: 5600, tokens_used: 890000, status: "published" },
      { name: "InvoiceBot", description: "AI that reads your emails and auto-generates invoices. Never chase payments again.", tech_stack: ["Python", "Claude API", "Gmail API"], commits: 167, lines_changed: 3400, tokens_used: 560000, status: "published" },
    ],
  },
  {
    display_name: "Sami Patel", username: "samip",
    bio: "Design engineer obsessed with motion. Previously at Vercel.",
    projects: [
      { name: "MotionKit", description: "Production-ready animation components for React. 60fps or your money back.", tech_stack: ["React", "Framer Motion", "TypeScript"], commits: 445, lines_changed: 12800, tokens_used: 1200000, status: "published" },
      { name: "Chromaflow", description: "Real-time color palette generator that understands your brand's personality.", tech_stack: ["Svelte", "Claude API", "Canvas"], commits: 189, lines_changed: 4200, tokens_used: 670000, status: "published" },
    ],
  },
  {
    display_name: "Jordan Mensah", username: "jordanm",
    bio: "Full-stack builder. 3 exits. Now vibe coding my next thing.",
    projects: [
      { name: "LaunchStack", description: "The fastest way to go from idea to deployed SaaS. Auth, payments, dashboard \u2014 all wired up.", tech_stack: ["Next.js", "Supabase", "Stripe", "Tailwind"], commits: 892, lines_changed: 28400, tokens_used: 3200000, status: "published" },
      { name: "WaitlistPro", description: "Beautiful waitlist pages with built-in referral tracking. Used by 200+ launches.", tech_stack: ["Next.js", "Resend", "Supabase"], commits: 234, lines_changed: 5600, tokens_used: 780000, status: "published" },
      { name: "Roast My Landing", description: "AI that reviews your landing page and gives brutally honest UX feedback.", tech_stack: ["Next.js", "Claude API", "Puppeteer"], commits: 156, lines_changed: 3800, tokens_used: 540000, status: "active" },
    ],
  },
  {
    display_name: "Yuki Tanaka", username: "yukit",
    bio: "Rust evangelist. Building CLI tools that don't suck.",
    projects: [
      { name: "quickserve", description: "Zero-config local dev server with live reload. 10x faster than anything Node-based.", tech_stack: ["Rust", "tokio", "hyper"], commits: 612, lines_changed: 15600, tokens_used: 1800000, status: "published" },
      { name: "tui-graph", description: "Beautiful graphs in your terminal. Sparklines, bar charts, scatter plots \u2014 all in ASCII.", tech_stack: ["Rust", "crossterm", "ratatui"], commits: 345, lines_changed: 8900, tokens_used: 980000, status: "published" },
    ],
  },
  {
    display_name: "Nia Okafor", username: "niao",
    bio: "AI researcher turned builder. Making ML accessible to everyone.",
    projects: [
      { name: "ModelPlayground", description: "Test any open-source ML model in your browser. No GPU required.", tech_stack: ["Python", "FastAPI", "WebAssembly", "React"], commits: 567, lines_changed: 18200, tokens_used: 2400000, status: "published" },
      { name: "DataClean", description: "Point it at any CSV and it fixes your data. Missing values, duplicates, type errors \u2014 gone.", tech_stack: ["Python", "Pandas", "Claude API"], commits: 234, lines_changed: 5600, tokens_used: 890000, status: "published" },
    ],
  },
  {
    display_name: "Marco Rossi", username: "marcor",
    bio: "Mobile dev from Milan. SwiftUI maximalist.",
    projects: [
      { name: "Budgetflow", description: "The only budget app that learns your spending patterns and predicts your month.", tech_stack: ["Swift", "SwiftUI", "CoreML", "CloudKit"], commits: 478, lines_changed: 14200, tokens_used: 1600000, status: "published" },
      { name: "Scanly", description: "Point your camera at any document. Instant OCR with smart field extraction.", tech_stack: ["Swift", "Vision", "CoreML"], commits: 312, lines_changed: 8900, tokens_used: 1100000, status: "active" },
    ],
  },
  {
    display_name: "Priya Krishnamurthy", username: "priyak",
    bio: "Backend architect. Distributed systems nerd. Building in Golang.",
    projects: [
      { name: "QueueSmith", description: "Dead simple job queue that scales to millions. Redis-backed, zero config.", tech_stack: ["Go", "Redis", "Docker"], commits: 723, lines_changed: 19800, tokens_used: 2100000, status: "published" },
    ],
  },
  {
    display_name: "Dante Williams", username: "dantew",
    bio: "Creative coder. Making art with algorithms.",
    projects: [
      { name: "GenerativeGarden", description: "Plant seeds of code, watch generative art grow. Each piece is unique and animated.", tech_stack: ["Three.js", "WebGL", "Claude API"], commits: 389, lines_changed: 11200, tokens_used: 1400000, status: "published" },
      { name: "SynthScape", description: "AI-generated ambient soundscapes that evolve based on time of day and weather.", tech_stack: ["Tone.js", "Claude API", "OpenWeather"], commits: 256, lines_changed: 6800, tokens_used: 920000, status: "published" },
      { name: "PixelMuse", description: "Turn text descriptions into pixel art. Retro aesthetics meet modern AI.", tech_stack: ["Canvas", "Claude API", "React"], commits: 178, lines_changed: 4500, tokens_used: 670000, status: "active" },
    ],
  },
  {
    display_name: "Elise Fontaine", username: "elisef",
    bio: "Ex-Google PM. Now building tools for solo founders.",
    projects: [
      { name: "FounderOS", description: "All-in-one dashboard for solo founders. Metrics, tasks, finances, customers \u2014 one screen.", tech_stack: ["Next.js", "Supabase", "Plaid", "Stripe"], commits: 934, lines_changed: 32000, tokens_used: 4100000, status: "published" },
      { name: "PitchCraft", description: "AI that writes your investor pitch deck. Just describe your startup in 3 sentences.", tech_stack: ["Next.js", "Claude API", "PPTX"], commits: 267, lines_changed: 7200, tokens_used: 890000, status: "published" },
    ],
  },
  {
    display_name: "Kai Lindstr\u00f6m", username: "kail",
    bio: "Swedish indie hacker. Building profitable tools, not venture-backed unicorns.",
    projects: [
      { name: "ShipFast", description: "Next.js SaaS boilerplate with auth, payments, email, and SEO baked in. Ship in a weekend.", tech_stack: ["Next.js", "Stripe", "Resend", "Tailwind"], commits: 567, lines_changed: 16800, tokens_used: 2200000, status: "published" },
    ],
  },
  {
    display_name: "Zara Ahmed", username: "zaraa",
    bio: "Data visualization obsessive. Making numbers beautiful.",
    projects: [
      { name: "ChartCraft", description: "Describe what you want to visualize in plain English. Get a production-ready D3 chart.", tech_stack: ["D3.js", "Claude API", "React"], commits: 345, lines_changed: 9800, tokens_used: 1300000, status: "published" },
      { name: "DashBuilder", description: "Drag-and-drop dashboard builder that connects to any API. No code needed.", tech_stack: ["React", "DnD Kit", "REST"], commits: 456, lines_changed: 13400, tokens_used: 1700000, status: "active" },
    ],
  },
  {
    display_name: "Tommy Nguyen", username: "tommyn",
    bio: "17-year-old builder. Shipping faster than most adults.",
    projects: [
      { name: "StudyPilot", description: "AI study assistant that turns any textbook chapter into flashcards, quizzes, and summaries.", tech_stack: ["React", "Claude API", "Supabase"], commits: 234, lines_changed: 6200, tokens_used: 780000, status: "published" },
      { name: "ClassroomAI", description: "Real-time AI tutor that adapts to your learning style. Built for students, by a student.", tech_stack: ["Next.js", "Claude API", "WebRTC"], commits: 189, lines_changed: 5100, tokens_used: 650000, status: "active" },
    ],
  },
  {
    display_name: "Rosa Martinez", username: "rosam",
    bio: "Healthcare tech builder. Fixing broken systems with code.",
    projects: [
      { name: "MedSchedule", description: "Smart scheduling for medical practices. Reduces no-shows by 40% with AI reminders.", tech_stack: ["Next.js", "Twilio", "Supabase", "Claude API"], commits: 678, lines_changed: 21000, tokens_used: 2800000, status: "published" },
    ],
  },
  {
    display_name: "Chris Olsen", username: "chriso",
    bio: "DevTools builder. Making developers 10x more productive.",
    projects: [
      { name: "GitFlow", description: "Visual git branch manager. See your repo's history as a beautiful interactive graph.", tech_stack: ["Electron", "D3.js", "Node.js"], commits: 512, lines_changed: 14800, tokens_used: 1900000, status: "published" },
      { name: "TerminalTheme", description: "AI-generated terminal themes based on your mood, music, or time of day.", tech_stack: ["Rust", "Claude API", "crossterm"], commits: 167, lines_changed: 4200, tokens_used: 560000, status: "published" },
    ],
  },
  {
    display_name: "Aisha Kamara", username: "aishak",
    bio: "Fintech builder. Democratizing financial tools for Africa.",
    projects: [
      { name: "SendCash", description: "Instant cross-border payments across Africa. Lower fees than Western Union.", tech_stack: ["React Native", "Node.js", "Stellar SDK"], commits: 834, lines_changed: 26000, tokens_used: 3400000, status: "published" },
      { name: "MicroLend", description: "P2P micro-lending platform with AI credit scoring. Banking the unbanked.", tech_stack: ["Next.js", "Python", "Supabase"], commits: 567, lines_changed: 18200, tokens_used: 2200000, status: "active" },
    ],
  },
  {
    display_name: "Leo Chen", username: "leoc",
    bio: "Game dev meets AI. Making interactive experiences that learn.",
    projects: [
      { name: "QuestForge", description: "AI dungeon master that creates unique storylines based on your play style.", tech_stack: ["Unity", "Claude API", "C#"], commits: 789, lines_changed: 24500, tokens_used: 3100000, status: "published" },
      { name: "ProcGen", description: "Procedural world generator for indie games. Infinite terrain, biomes, and structures.", tech_stack: ["Rust", "WebGPU", "noise-rs"], commits: 456, lines_changed: 13800, tokens_used: 1800000, status: "active" },
    ],
  },
  {
    display_name: "Fatima Al-Hassan", username: "fatimah",
    bio: "NLP researcher. Building language tools for Arabic speakers.",
    projects: [
      { name: "ArabiChat", description: "Arabic-first AI chatbot with dialect understanding. Supports Gulf, Egyptian, and Levantine.", tech_stack: ["Python", "Claude API", "FastAPI"], commits: 345, lines_changed: 9200, tokens_used: 1200000, status: "published" },
    ],
  },
  {
    display_name: "Ben Harper", username: "benh",
    bio: "Ex-Netflix engineer. Building the future of streaming tools.",
    projects: [
      { name: "StreamDeck", description: "Analytics dashboard for content creators. See what works across YouTube, Twitch, TikTok.", tech_stack: ["Next.js", "YouTube API", "Supabase"], commits: 423, lines_changed: 12600, tokens_used: 1500000, status: "published" },
      { name: "ClipAI", description: "AI that watches your streams and auto-generates highlight clips. TikTok-ready.", tech_stack: ["Python", "FFmpeg", "Claude API"], commits: 289, lines_changed: 7800, tokens_used: 980000, status: "published" },
    ],
  },
  {
    display_name: "Nina Kowalski", username: "ninak",
    bio: "Accessibility advocate. Building inclusive tools.",
    projects: [
      { name: "A11yCheck", description: "Paste any URL and get an instant accessibility audit with fix suggestions.", tech_stack: ["Next.js", "Puppeteer", "Claude API"], commits: 234, lines_changed: 6400, tokens_used: 780000, status: "published" },
    ],
  },
  {
    display_name: "Jake Oduya", username: "jakeo",
    bio: "Sports tech builder. Data nerd. Arsenal fan.",
    projects: [
      { name: "StatsCast", description: "Real-time sports analytics overlay for live broadcasts. See xG, heatmaps, pass networks.", tech_stack: ["Python", "OpenCV", "React", "WebSocket"], commits: 678, lines_changed: 19800, tokens_used: 2600000, status: "published" },
      { name: "FantasyAI", description: "AI-powered fantasy football assistant. Optimal lineups based on 50+ data points.", tech_stack: ["Python", "Claude API", "Next.js"], commits: 345, lines_changed: 9200, tokens_used: 1100000, status: "published" },
    ],
  },
  {
    display_name: "Mia S\u00f8rensen", username: "mias",
    bio: "Copenhagen-based. Building calm software.",
    projects: [
      { name: "FocusFlow", description: "Minimalist task manager that hides everything except what matters right now.", tech_stack: ["Svelte", "Supabase", "Tailwind"], commits: 189, lines_changed: 4800, tokens_used: 560000, status: "published" },
      { name: "WindDown", description: "Evening routine app that gradually dims your screen and guides you to sleep.", tech_stack: ["Swift", "HealthKit", "SwiftUI"], commits: 134, lines_changed: 3600, tokens_used: 420000, status: "active" },
    ],
  },
  {
    display_name: "Ravi Patel", username: "ravip",
    bio: "API builder. Making integrations painless.",
    projects: [
      { name: "APIBridge", description: "Connect any two APIs with a visual flow builder. Zapier but for developers.", tech_stack: ["Node.js", "React Flow", "Redis"], commits: 567, lines_changed: 16200, tokens_used: 2000000, status: "published" },
    ],
  },
  {
    display_name: "Sophie Dubois", username: "sophied",
    bio: "French-Canadian. Building education tools with AI.",
    projects: [
      { name: "LessonForge", description: "Teachers describe a topic, AI generates a full lesson plan with activities and assessments.", tech_stack: ["Next.js", "Claude API", "Supabase"], commits: 312, lines_changed: 8400, tokens_used: 1100000, status: "published" },
      { name: "QuizWhiz", description: "Upload any PDF or article. Get an instant quiz with difficulty scaling.", tech_stack: ["React", "Claude API", "PDF.js"], commits: 223, lines_changed: 5800, tokens_used: 780000, status: "published" },
    ],
  },
  {
    display_name: "Oscar Mendez", username: "oscarm",
    bio: "Automation junkie. If I do it twice, I automate it.",
    projects: [
      { name: "FlowBot", description: "Visual automation builder for your terminal. Cron jobs, file watchers, API calls \u2014 all connected.", tech_stack: ["Go", "Bubble Tea", "SQLite"], commits: 456, lines_changed: 13200, tokens_used: 1700000, status: "published" },
      { name: "ScriptVault", description: "Searchable library of your shell scripts with AI-generated documentation.", tech_stack: ["Rust", "Claude API", "SQLite"], commits: 178, lines_changed: 4500, tokens_used: 560000, status: "active" },
    ],
  },
  {
    display_name: "Lena Voss", username: "lenav",
    bio: "Berlin-based. Building tools for the creator economy.",
    projects: [
      { name: "CreatorPay", description: "Payment links designed for creators. Beautiful checkout, instant payouts, zero friction.", tech_stack: ["Next.js", "Stripe", "Supabase"], commits: 534, lines_changed: 15600, tokens_used: 2000000, status: "published" },
      { name: "LinkBio", description: "AI-generated link-in-bio pages that actually convert. Paste your socials, get a stunning page.", tech_stack: ["Next.js", "Claude API", "Tailwind"], commits: 267, lines_changed: 7200, tokens_used: 890000, status: "published" },
    ],
  },
];

// Popular users who should have many followers
const POPULAR_HANDLES = ["jordanm", "elisef", "aishak", "samip", "leoc", "niao"];

export async function POST(request: Request) {
  const seedKey = request.headers.get("x-seed-key");
  if (seedKey !== SEED_KEY) {
    return NextResponse.json({ error: "Invalid seed key" }, { status: 401 });
  }

  // Check if already seeded
  const { count } = await supabaseAdmin
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if ((count || 0) > 5) {
    return NextResponse.json({ error: "Already seeded", profileCount: count }, { status: 409 });
  }

  const profileIds: Record<string, string> = {};
  let totalProjects = 0;

  // Insert profiles and projects
  for (const p of PROFILES) {
    const totalTokens = p.projects.reduce((s, proj) => s + proj.tokens_used, 0);
    const totalCommits = p.projects.reduce((s, proj) => s + proj.commits, 0);
    const streakDays = randomBetween(0, 45);
    const hoursThisMonth = Math.round(totalCommits * 0.65 / Math.max(1, randomBetween(1, 6)));
    const createdAt = randomDateAgo(30, 180);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        username: p.username,
        display_name: p.display_name,
        bio: p.bio,
        total_tokens_used: totalTokens,
        tokens_today: randomBetween(0, Math.round(totalTokens / 90)),
        streak_days: streakDays,
        hours_this_month: hoursThisMonth,
        created_at: createdAt,
        narwhal_api_key: crypto.randomUUID(),
      })
      .select("id")
      .single();

    if (profileError || !profile) {
      console.error(`Failed to insert profile ${p.username}:`, profileError);
      continue;
    }

    profileIds[p.username] = profile.id;

    // Insert projects for this profile
    for (const proj of p.projects) {
      const downloads = proj.status === "published" ? randomBetween(100, 15000) : 0;

      const { error: projError } = await supabaseAdmin.from("projects").insert({
        user_id: profile.id,
        name: proj.name,
        description: proj.description,
        tech_stack: proj.tech_stack,
        status: proj.status,
        tokens_used: proj.tokens_used,
        commits: proj.commits,
        lines_changed: proj.lines_changed,
        downloads,
        last_activity: randomRecentDate(),
      });

      if (projError) {
        console.error(`Failed to insert project ${proj.name}:`, projError);
      } else {
        totalProjects++;
      }
    }
  }

  // Create follow relationships (~50 pairs)
  const allHandles = Object.keys(profileIds);
  const followPairs: { follower_id: string; following_id: string }[] = [];
  const seen = new Set<string>();

  // Ensure popular users get many followers
  for (const popular of POPULAR_HANDLES) {
    if (!profileIds[popular]) continue;
    // Each popular user gets 8-15 followers
    const followerCount = randomBetween(8, 15);
    const potentialFollowers = allHandles.filter((h) => h !== popular);
    const shuffled = potentialFollowers.sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(followerCount, shuffled.length); i++) {
      const key = `${shuffled[i]}->${popular}`;
      if (!seen.has(key)) {
        seen.add(key);
        followPairs.push({
          follower_id: profileIds[shuffled[i]],
          following_id: profileIds[popular],
        });
      }
    }
  }

  // Add some random follow pairs to reach ~50 total
  while (followPairs.length < 50) {
    const a = allHandles[randomBetween(0, allHandles.length - 1)];
    const b = allHandles[randomBetween(0, allHandles.length - 1)];
    if (a === b) continue;
    const key = `${a}->${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    followPairs.push({
      follower_id: profileIds[a],
      following_id: profileIds[b],
    });
  }

  // Insert follows in batches
  if (followPairs.length > 0) {
    const { error: followError } = await supabaseAdmin
      .from("follows")
      .insert(followPairs);
    if (followError) {
      console.error("Failed to insert follows:", followError);
    }
  }

  return NextResponse.json({
    success: true,
    profiles: Object.keys(profileIds).length,
    projects: totalProjects,
    follows: followPairs.length,
  });
}
