"use client";

import { getGreeting, formatNumber, getPercentile } from "@/lib/helpers";
import type { Profile, Project } from "@/lib/types";
import type { NewsEntry } from "@/lib/ai-news-feed";

interface DailyBriefingProps {
  currentUser: Profile;
  feedProjects: (Project & { profiles: Profile })[];
  allUsers: Profile[];
  trendingNews?: NewsEntry;
}

export default function DailyBriefing({ currentUser, feedProjects, allUsers, trendingNews }: DailyBriefingProps) {
  const greeting = getGreeting();
  const displayName = currentUser.display_name || currentUser.username;

  const todayUpdates = feedProjects.length;

  const allStreaks = allUsers.map((u) => u.streak_days);
  const streakPercentile = getPercentile(currentUser.streak_days, allStreaks);

  const topBuilder = allUsers.length > 0
    ? allUsers.reduce((best, u) => (u.tokens_today > best.tokens_today ? u : best), allUsers[0])
    : null;

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderLeft: "3px solid var(--accent-primary)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <h2 className="text-[18px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
        {greeting}, {displayName}
      </h2>
      <div className="flex flex-col gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
        <p>Your network shipped {todayUpdates} update{todayUpdates !== 1 ? "s" : ""} today.</p>
        {currentUser.streak_days > 0 && (
          <p>
            You&apos;re on a {currentUser.streak_days}-day streak
            {streakPercentile <= 20 && ` \u2014 top ${streakPercentile}% of builders`}.
          </p>
        )}
        {topBuilder && topBuilder.tokens_today > 0 && (
          <p>
            Community highlight: <span className="font-medium" style={{ color: "var(--text-primary)" }}>{topBuilder.display_name || topBuilder.username}</span> hit{" "}
            <span className="font-mono" style={{ color: "var(--accent-primary)" }}>{formatNumber(topBuilder.tokens_today)}</span> tokens today.
          </p>
        )}
        {trendingNews && (
          <p>
            Trending: <span style={{ color: "var(--text-primary)" }}>{trendingNews.title}</span>
          </p>
        )}
      </div>
    </div>
  );
}
