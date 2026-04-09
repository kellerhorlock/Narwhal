"use client";

import { Compass, Search, Trophy, User, Sparkles } from "lucide-react";
import Avatar from "./Avatar";
import BuilderScoreBadge from "./BuilderScoreBadge";
import ActivityPulse from "./ActivityPulse";
import { formatNumber, calculateBuilderScore } from "@/lib/helpers";
import type { Profile, Project } from "@/lib/types";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  profile: Profile | null;
  publishedCount?: number;
  totalDownloads?: number;
  estimatedTokens?: number;
  feedProjects?: (Project & { profiles: Profile })[];
}

const NAV_ITEMS = [
  { id: "feed", label: "For You", icon: Compass },
  { id: "search", label: "Search", icon: Search },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy, badge: "Live" },
  { id: "profile", label: "Profile", icon: User },
];

function safeNum(v: unknown): number {
  if (v === null || v === undefined) return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function statDisplay(value: unknown, suffix = ""): string {
  const n = safeNum(value);
  if (n === 0) return "\u2014";
  return formatNumber(n) + suffix;
}

export default function Sidebar({ activeTab, onTabChange, profile, publishedCount = 0, totalDownloads = 0, estimatedTokens = 0, feedProjects = [] }: SidebarProps) {
  const score = profile
    ? calculateBuilderScore(
        estimatedTokens,
        publishedCount,
        totalDownloads,
        safeNum(profile.streak_days),
        safeNum(profile.hours_this_month)
      )
    : null;

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex w-[240px] flex-col border-r px-4 py-6 z-50"
      style={{
        borderColor: "var(--border-subtle)",
        background: "linear-gradient(to bottom, rgba(8,14,24,0.98), rgba(6,10,18,1))",
      }}
    >
      {/* Logo */}
      <button onClick={() => onTabChange("feed")} className="flex items-center gap-2.5 px-3 mb-8">
        <svg width="32" height="32" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="40" y1="4" x2="40" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="37" y1="10" x2="43" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="37" y1="17" x2="43" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <ellipse cx="40" cy="44" rx="22" ry="16" stroke="white" strokeWidth="2" fill="none" />
          <path d="M18 44 C10 44, 6 36, 12 32" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M12 32 C8 28, 4 32, 8 36" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M34 56 C32 64, 38 66, 40 60" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="50" cy="40" r="2" fill="white" />
          <path d="M56 46 C58 48, 60 47, 61 45" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
        <span className="text-lg font-bold text-foreground tracking-tight">Narwhal</span>
      </button>

      {/* Nav items */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                padding: "12px 16px",
                background: active ? "var(--accent-blue-active)" : undefined,
                color: active ? "#f0f0f5" : "#42424f",
                borderLeft: `3px solid ${active ? "#38ef7d" : "transparent"}`,
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--bg-card-hover)"; e.currentTarget.style.color = "#f0f0f5"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = ""; e.currentTarget.style.color = active ? "#f0f0f5" : "#42424f"; }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Setup Agent link */}
      <button
        onClick={() => onTabChange("setup")}
        className="mt-4 flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150"
        style={{
          padding: "12px 16px",
          background: activeTab === "setup" ? "var(--accent-blue-active)" : undefined,
          color: activeTab === "setup" ? "#f0f0f5" : "#42424f",
          borderLeft: `3px solid ${activeTab === "setup" ? "#38ef7d" : "transparent"}`,
        }}
        onMouseEnter={(e) => { if (activeTab !== "setup") e.currentTarget.style.background = "var(--bg-card-hover)"; e.currentTarget.style.color = "#f0f0f5"; }}
        onMouseLeave={(e) => { if (activeTab !== "setup") e.currentTarget.style.background = ""; e.currentTarget.style.color = activeTab === "setup" ? "#f0f0f5" : "#42424f"; }}
      >
        <Sparkles size={18} />
        <span>Setup Agent</span>
      </button>

      {/* Activity Pulse */}
      <ActivityPulse feedProjects={feedProjects} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* User card */}
      {profile && (
        <div
          className="rounded-xl p-4"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <Avatar name={profile.display_name || profile.username} size={34} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground truncate">
                {profile.display_name || profile.username}
              </div>
              <div className="text-xs text-muted truncate">@{profile.username}</div>
            </div>
          </div>
          {/* Builder Score — only show if meaningful */}
          <BuilderScoreBadge score={score ? score.total : 0} size="sm" />
          {score && score.total > 0 && !isNaN(score.total) && <div className="mb-1" />}
          <div className="grid grid-cols-3 gap-2 text-center mt-2">
            <div>
              <div className="text-[14px] font-bold font-mono text-accent">
                {statDisplay(estimatedTokens)}
              </div>
              <div className="text-[9px] text-muted uppercase">3mo</div>
            </div>
            <div>
              <div className="text-[14px] font-bold font-mono text-foreground">
                {statDisplay(profile.streak_days, "d")}
              </div>
              <div className="text-[9px] text-muted uppercase">Streak</div>
            </div>
            <div>
              <div className="text-[14px] font-bold font-mono text-foreground">
                {statDisplay(profile.hours_this_month, "h")}
              </div>
              <div className="text-[9px] text-muted uppercase">Hours</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
