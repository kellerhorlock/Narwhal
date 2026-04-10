"use client";

import { Compass, Search, Trophy, User, Sparkles } from "lucide-react";
import NarwhalIcon from "./NarwhalIcon";
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
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
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
      className="fixed left-0 top-0 bottom-0 flex w-[240px] flex-col px-4 py-6 z-50"
      style={{
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border-default)",
        boxShadow: "1px 0 3px rgba(15,23,42,0.03)",
      }}
    >
      {/* Logo */}
      <button onClick={() => onTabChange("feed")} className="flex items-center gap-2.5 px-3 mb-8">
        <NarwhalIcon size={26} style={{ color: "var(--text-primary)" }} />
        <span className="text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>Narwhal</span>
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
              className="flex items-center gap-3 rounded-lg text-sm transition-colors duration-150"
              style={{
                padding: "10px 16px",
                background: active ? "var(--accent-primary-light)" : undefined,
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                borderLeft: `2px solid ${active ? "var(--accent-primary)" : "transparent"}`,
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--text-secondary)"; } }}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 my-3" style={{ borderTop: "1px solid var(--border-default)" }} />

      {/* Setup Agent link */}
      <button
        onClick={() => onTabChange("setup")}
        className="flex items-center gap-3 rounded-lg text-sm transition-colors duration-150"
        style={{
          padding: "10px 16px",
          background: activeTab === "setup" ? "var(--accent-primary-light)" : undefined,
          color: activeTab === "setup" ? "var(--text-primary)" : "var(--text-secondary)",
          borderLeft: `2px solid ${activeTab === "setup" ? "var(--accent-primary)" : "transparent"}`,
        }}
        onMouseEnter={(e) => { if (activeTab !== "setup") { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
        onMouseLeave={(e) => { if (activeTab !== "setup") { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--text-secondary)"; } }}
      >
        <Sparkles size={18} strokeWidth={1.8} />
        <span>Setup Agent</span>
      </button>

      {/* Activity Pulse */}
      <ActivityPulse feedProjects={feedProjects} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* User card */}
      {profile && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}>
          <div className="flex items-center gap-2.5 mb-2">
            <Avatar name={profile.display_name || profile.username} size={32} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {profile.display_name || profile.username}
              </div>
              <div className="text-[12px] font-mono truncate" style={{ color: "var(--text-muted)" }}>@{profile.username}</div>
            </div>
          </div>
          <BuilderScoreBadge score={score ? score.total : 0} size="sm" />
          {score && score.total > 0 && !isNaN(score.total) && <div className="mb-1" />}
          <div className="grid grid-cols-3 gap-2 text-center mt-2">
            <div>
              <div className="text-[13px] font-bold font-mono" style={{ color: "var(--accent-primary)" }}>
                {statDisplay(estimatedTokens)}
              </div>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Tokens</div>
            </div>
            <div>
              <div className="text-[13px] font-bold font-mono" style={{ color: "var(--text-primary)" }}>
                {statDisplay(profile.streak_days, "d")}
              </div>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Streak</div>
            </div>
            <div>
              <div className="text-[13px] font-bold font-mono" style={{ color: "var(--text-primary)" }}>
                {statDisplay(profile.hours_this_month, "h")}
              </div>
              <div className="text-[9px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Hours</div>
            </div>
          </div>
        </div>
      )}

      {/* Brand watermark */}
      <div className="flex items-center gap-1.5 px-3 mt-4">
        <NarwhalIcon size={16} style={{ color: "var(--text-muted)" }} />
        <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>Narwhal</span>
      </div>
    </aside>
  );
}
