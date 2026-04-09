export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

const GRADIENT_PALETTES = [
  ["#667eea", "#5a3fbf", "#764ba2", "#9b59b6"],
  ["#f093fb", "#e056a0", "#f5576c", "#ff6b81"],
  ["#4facfe", "#2196f3", "#00b4d8", "#00f2fe"],
  ["#43e97b", "#2ecc71", "#1abc9c", "#38f9d7"],
  ["#fa709a", "#e74c7a", "#f39c12", "#fee140"],
  ["#a18cd1", "#8e44ad", "#c39bd3", "#fbc2eb"],
  ["#fccb90", "#e8a87c", "#c56cd6", "#d57eeb"],
  ["#e0c3fc", "#b8a9c9", "#6c7ce4", "#8ec5fc"],
  ["#f5576c", "#e74c3c", "#ff8a5c", "#ff6a88"],
  ["#667eea", "#41b883", "#2dce89", "#38ef7d"],
  ["#ff9a9e", "#ff6b6b", "#ee9ca7", "#fad0c4"],
  ["#a1c4fd", "#6eb5ff", "#89d4cf", "#c2e9fb"],
  ["#fddb92", "#f6d365", "#93f5ec", "#d1fdff"],
  ["#96fbc4", "#74e8a5", "#c6f16e", "#f9f586"],
  ["#cd9cf2", "#b47ede", "#d4aaff", "#f6f3ff"],
  ["#e2b0ff", "#c77dff", "#7b2ff7", "#9f44d3"],
];

export function generateGradientSVG(name: string, width = 400, height = 240): string {
  const hash = hashString(name);
  const palette = GRADIENT_PALETTES[hash % GRADIENT_PALETTES.length];
  const angle = (hash % 360);
  const rad = (angle * Math.PI) / 180;
  const x1 = 50 - Math.cos(rad) * 50;
  const y1 = 50 - Math.sin(rad) * 50;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 + Math.sin(rad) * 50;

  const stops = palette.map((color, i) => {
    const offset = Math.round((i / (palette.length - 1)) * 100);
    return `<stop offset="${offset}%" stop-color="${color}"/>`;
  }).join("");

  // Subtle noise texture via a semi-transparent fractal pattern
  const noiseFilter = `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.08"/></feComponentTransfer></filter>`;

  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="g" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
          ${stops}
        </linearGradient>
        ${noiseFilter}
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)"/>
      <rect width="${width}" height="${height}" filter="url(#n)"/>
    </svg>`
  )}`;
}

export function estimateWorkTime(commits: number): string {
  if (commits === 0) return "Just started";
  const hours = commits * 0.65;
  if (hours < 100) return `~${Math.round(hours)}h`;
  const days = Math.round(hours / 8);
  return `~${days}d`;
}

export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined || isNaN(n) || n === 0) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export function getAvatarGradient(name: string): string {
  const gradients = [
    "linear-gradient(135deg, #667eea, #764ba2)",
    "linear-gradient(135deg, #f093fb, #f5576c)",
    "linear-gradient(135deg, #4facfe, #00f2fe)",
    "linear-gradient(135deg, #43e97b, #38f9d7)",
    "linear-gradient(135deg, #fa709a, #fee140)",
    "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    "linear-gradient(135deg, #667eea, #38ef7d)",
    "linear-gradient(135deg, #e2b0ff, #9f44d3)",
  ];
  return gradients[hashString(name) % gradients.length];
}

const ACTION_VERBS = [
  "published",
  "shipped",
  "is building",
  "launched",
  "updated",
  "released",
];

export function getActionVerb(projectName: string): string {
  return ACTION_VERBS[hashString(projectName) % ACTION_VERBS.length];
}

// Builder Score system
export interface BuilderScoreBreakdown {
  tokens: number;
  projects: number;
  downloads: number;
  streak: number;
  hours: number;
  total: number;
}

export function calculateBuilderScore(
  totalTokens: number,
  publishedProjects: number,
  totalDownloads: number,
  streakDays: number,
  hoursThisMonth: number
): BuilderScoreBreakdown {
  const tokens = Math.min(Math.floor(totalTokens / 10_000), 200);
  const projects = Math.min(publishedProjects * 30, 300);
  const downloads = Math.min(Math.floor(totalDownloads / 100), 200);
  const streak = Math.min(streakDays * 3, 150);
  const hours = Math.min(hoursThisMonth, 150);
  return { tokens, projects, downloads, streak, hours, total: tokens + projects + downloads + streak + hours };
}

export function getPercentile(score: number, allScores: number[]): number {
  if (allScores.length === 0) return 1;
  const below = allScores.filter((s) => s < score).length;
  const pct = Math.round(((allScores.length - below) / allScores.length) * 100);
  return Math.max(pct, 1);
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function getWeekLabel(): string {
  const now = new Date();
  return now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function generateWeeklySummary(
  projectNames: string[],
  totalCommits: number,
  projectCount: number
): string {
  const focus = projectNames.length > 0 ? `Focused on ${projectNames[0]}. ` : "";
  const intensity =
    totalCommits > 500 ? "Heavy" : totalCommits > 100 ? "Productive" : totalCommits > 0 ? "Steady" : "Quiet";
  const area = "coding";
  const across = projectCount > 1 ? ` across ${projectCount} projects` : projectCount === 1 ? " on 1 project" : "";
  return `${focus}${intensity} ${area} week. ${formatNumber(totalCommits)} commits${across}.`;
}

export function generateProjectInsights(
  name: string,
  techStack: string[],
  tokens: number,
  commits: number,
  downloads: number,
  linesChanged: number,
  allDownloads: number[]
): string[] {
  const lines: string[] = [];

  const techStr = techStack.length > 0 ? ` with ${techStack.join(", ")}` : "";
  const tokensPerCommit = commits > 0 ? Math.round(tokens / commits) : 0;
  let main = `Built over ${formatNumber(commits)} commits${techStr}.`;
  if (tokens > 0) main += ` ${formatNumber(tokens)} tokens consumed`;
  if (tokensPerCommit > 0) main += `, averaging ${formatNumber(tokensPerCommit)} per commit`;
  main += ".";
  if (downloads > 0) main += ` ${formatNumber(downloads)} developers have downloaded this project.`;
  lines.push(main);

  if (allDownloads.length > 0) {
    const threshold = [...allDownloads].sort((a, b) => b - a)[Math.floor(allDownloads.length * 0.1)] || 0;
    if (downloads > threshold && downloads > 0) {
      lines.push("Top 10% most downloaded on Narwhal");
    }
  }

  if (commits > 200) {
    lines.push("One of the most actively developed projects on the platform");
  }

  return lines;
}
