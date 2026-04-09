"use client";

import { formatNumber, estimateWorkTime } from "@/lib/helpers";

interface HumanMachineStatsProps {
  totalCommits: number;
  projectCount: number;
  launchedCount: number;
  followerCount: number;
  followingCount: number;
  createdAt: string;
  totalTokens: number;
  totalLinesChanged: number;
  projectsWithAI: number;
  streakDays: number;
}

function renderVal(v: number | string | null): string {
  if (v === null || v === undefined) return "\u2014";
  if (typeof v === "string") return v;
  if (isNaN(v) || v === 0) return "\u2014";
  return formatNumber(v);
}

export default function HumanMachineStats({
  totalCommits,
  projectCount,
  launchedCount,
  followerCount,
  followingCount,
  createdAt,
  totalTokens,
  totalLinesChanged,
  projectsWithAI,
  streakDays,
}: HumanMachineStatsProps) {
  const hoursBuilding = estimateWorkTime(totalCommits);
  const shipRate = projectCount > 0 && launchedCount > 0
    ? `${Math.round((launchedCount / projectCount) * 100)}%`
    : null;
  const daysOnPlatform = Math.max(1, Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)));
  const avgTokensPerCommit = totalCommits > 0 && totalTokens > 0
    ? Math.round(totalTokens / totalCommits)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* THE HUMAN */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(255,180,100,0.03)",
          borderLeft: "3px solid rgba(255,180,100,0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm">👤</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,180,100,0.7)" }}>
            The Human
          </span>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-4">
          <Stat label="Hours Building" value={hoursBuilding} />
          <Stat label="Projects" value={projectCount} />
          <Stat label="Launched" value={launchedCount} />
          <Stat label="Ship Rate" value={shipRate} />
          <Stat label="Followers" value={followerCount} />
          <Stat label="Following" value={followingCount} />
          <Stat label="Days on Platform" value={daysOnPlatform} />
        </div>
      </div>

      {/* THE MACHINE */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "rgba(100,160,255,0.03)",
          borderLeft: "3px solid rgba(100,160,255,0.15)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm">🤖</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "rgba(100,160,255,0.7)" }}>
            The Machine
          </span>
        </div>
        <div className="grid grid-cols-3 gap-x-4 gap-y-4">
          <Stat label="Tokens Consumed" value={totalTokens} green mono />
          <Stat label="Total Commits" value={totalCommits} mono />
          <Stat label="Lines of Code" value={totalLinesChanged} mono />
          <Stat label="Avg Tokens/Commit" value={avgTokensPerCommit} mono />
          <Stat label="Projects with AI" value={projectsWithAI} mono />
          <Stat label="Streak" value={streakDays > 0 ? `${streakDays}d` : null} mono />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, green, mono }: { label: string; value: number | string | null; green?: boolean; mono?: boolean }) {
  return (
    <div>
      <div className={`text-[16px] font-bold ${green ? "text-accent" : "text-foreground"} ${mono ? "font-mono" : ""}`}>
        {renderVal(value)}
      </div>
      <div className="text-[9px] font-medium uppercase tracking-wider text-muted mt-0.5">
        {label}
      </div>
    </div>
  );
}
