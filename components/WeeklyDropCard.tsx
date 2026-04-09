"use client";

import { useState } from "react";
import { formatNumber, getWeekLabel, generateWeeklySummary, deriveStats, formatTokens } from "@/lib/helpers";
import { Share2, Check } from "lucide-react";
import type { Project } from "@/lib/types";

interface WeeklyDropCardProps {
  projects: Project[];
  followerDelta: number;
}

export default function WeeklyDropCard({ projects, followerDelta }: WeeklyDropCardProps) {
  const [copied, setCopied] = useState(false);

  const totalCommits = projects.reduce((s, p) => s + (p.commits || 0), 0);
  const stats = deriveStats(totalCommits);
  const projectNames = projects.map((p) => p.name);
  const summary = generateWeeklySummary(projectNames, totalCommits, projects.length);
  const humanHours = stats.hoursBuilding > 0 ? `~${stats.hoursBuilding}h` : "Just started";

  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--bg-surface)",
        borderLeft: "2px solid rgba(52, 211, 153, 0.15)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[14px] font-medium" style={{ color: "var(--text-primary)" }}>
          Week of {getWeekLabel()}
        </h3>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-colors duration-150"
          style={{ border: "1px solid var(--border-ice)", color: "var(--text-secondary)" }}
        >
          {copied ? <Check size={11} style={{ color: "var(--accent-green)" }} /> : <Share2 size={11} />}
          {copied ? "Copied!" : "Share"}
        </button>
      </div>

      <div className="flex flex-col gap-1.5 mb-3">
        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
          You: <span className="font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{humanHours}</span> building · <span className="font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{projects.length}</span> project{projects.length !== 1 ? "s" : ""}
        </div>
        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
          AI: <span className="font-mono font-semibold" style={{ color: "var(--accent-green)" }}>{totalCommits > 0 ? formatTokens(totalCommits) : "0"}</span> tokens · <span className="font-mono font-semibold" style={{ color: "var(--text-primary)" }}>{formatNumber(totalCommits)}</span> commits
        </div>
      </div>

      <p className="text-[13px] italic" style={{ color: "var(--text-secondary)" }}>{summary}</p>
    </div>
  );
}
