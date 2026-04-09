"use client";

import { useState } from "react";
import { formatNumber, getWeekLabel, generateWeeklySummary, estimateWorkTime } from "@/lib/helpers";
import { Share2, Check } from "lucide-react";
import type { Project } from "@/lib/types";

interface WeeklyDropCardProps {
  projects: Project[];
  followerDelta: number;
}

export default function WeeklyDropCard({ projects, followerDelta }: WeeklyDropCardProps) {
  const [copied, setCopied] = useState(false);

  const totalCommits = projects.reduce((s, p) => s + (p.commits || 0), 0);
  const totalTokens = projects.reduce((s, p) => s + (p.tokens_used || 0), 0);
  const projectNames = projects.map((p) => p.name);
  const summary = generateWeeklySummary(projectNames, totalCommits, projects.length);
  const humanHours = estimateWorkTime(totalCommits);

  async function handleShare() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-accent/15 bg-gradient-to-r from-accent/[0.03] to-transparent p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          Week of {getWeekLabel()}
        </h3>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted hover:text-foreground hover:border-muted transition-colors duration-150"
        >
          {copied ? <Check size={11} className="text-accent" /> : <Share2 size={11} />}
          {copied ? "Copied!" : "Share"}
        </button>
      </div>

      {/* Human vs Machine mini split */}
      <div className="flex flex-col gap-1.5 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px]">👤</span>
          <span className="text-foreground/70">
            You: <span className="font-mono font-semibold text-foreground">{humanHours}</span> building · <span className="font-mono font-semibold text-foreground">{projects.length}</span> project{projects.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px]">🤖</span>
          <span className="text-foreground/70">
            AI: <span className="font-mono font-semibold text-accent">{formatNumber(totalTokens)}</span> tokens · <span className="font-mono font-semibold text-foreground">{formatNumber(totalCommits)}</span> commits
          </span>
        </div>
      </div>

      <p className="text-xs text-foreground/50 italic">{summary}</p>
    </div>
  );
}
