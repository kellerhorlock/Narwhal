"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { formatNumber, calculateBuilderScore } from "@/lib/helpers";
import Avatar from "./Avatar";
import EmptyState from "./EmptyState";
import type { Profile } from "@/lib/types";

interface LeaderboardViewProps {
  currentUserId: string;
  onUserClick: (username: string) => void;
  onTabChange?: (tab: string) => void;
}

type Mode = "everyone" | "following" | "score";

export default function LeaderboardView({ currentUserId, onUserClick, onTabChange }: LeaderboardViewProps) {
  const [mode, setMode] = useState<Mode>("everyone");
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [userPublished, setUserPublished] = useState<Record<string, number>>({});
  const [userDownloads, setUserDownloads] = useState<Record<string, number>>({});
  const [communityStats, setCommunityStats] = useState({ tokens: 0, builders: 0, shipped: 0, downloads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [{ data: users }, { data: follows }, { data: projects }] = await Promise.all([
        supabase.from("profiles").select("*").order("tokens_today", { ascending: false }),
        supabase.from("follows").select("following_id").eq("follower_id", currentUserId),
        supabase.from("projects").select("user_id, status, downloads"),
      ]);

      setAllUsers(users || []);
      setFollowingIds(new Set((follows || []).map((f) => f.following_id)));

      // Build per-user stats for builder score
      const pub: Record<string, number> = {};
      const dl: Record<string, number> = {};
      for (const p of projects || []) {
        if (p.status === "published") pub[p.user_id] = (pub[p.user_id] || 0) + 1;
        dl[p.user_id] = (dl[p.user_id] || 0) + (p.downloads || 0);
      }
      setUserPublished(pub);
      setUserDownloads(dl);

      const totalTokens = (users || []).reduce((s, u) => s + u.total_tokens_used, 0);
      const shipped = (projects || []).filter((p) => p.status === "published").length;
      const totalDownloads = (projects || []).reduce((s, p) => s + (p.downloads || 0), 0);
      setCommunityStats({
        tokens: totalTokens,
        builders: (users || []).length,
        shipped,
        downloads: totalDownloads,
      });
      setLoading(false);
    }
    load();
  }, [currentUserId]);

  const ranked = useMemo(() => {
    let list = allUsers;
    if (mode === "following") {
      list = list.filter((u) => followingIds.has(u.id) || u.id === currentUserId);
    }
    if (mode === "score") {
      list = [...list].sort((a, b) => {
        const sa = calculateBuilderScore(a.total_tokens_used, userPublished[a.id] || 0, userDownloads[a.id] || 0, a.streak_days, a.hours_this_month).total;
        const sb = calculateBuilderScore(b.total_tokens_used, userPublished[b.id] || 0, userDownloads[b.id] || 0, b.streak_days, b.hours_this_month).total;
        return sb - sa;
      });
    }
    return list;
  }, [allUsers, mode, followingIds, currentUserId, userPublished, userDownloads]);

  const getDisplayValue = (user: Profile) => {
    if (mode === "score") {
      return calculateBuilderScore(user.total_tokens_used, userPublished[user.id] || 0, userDownloads[user.id] || 0, user.streak_days, user.hours_this_month).total;
    }
    return user.tokens_today;
  };

  const valueLabel = mode === "score" ? "score" : "tokens today";

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const medals = ["🥈", "👑", "🥉"];
  const podiumSizes = [56, 80, 56];
  const barHeights = [80, 120, 60];

  if (loading) {
    return <div className="text-muted py-20 text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="font-serif italic text-foreground mb-3" style={{ fontSize: 42 }}>Leaderboard</h1>
      <p className="mb-6" style={{ fontSize: 14, color: "#52525f" }}>
        {mode === "score" ? "Builder score rankings" : "Today\u2019s token consumption rankings"}
      </p>

      {/* Toggle */}
      <div className="flex max-w-[380px] rounded-lg border border-border bg-card p-1 mb-8">
        {(["everyone", "following", "score"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-md px-4 py-1.5 text-xs font-semibold capitalize transition-colors duration-150 ${
              mode === m ? "bg-white/[0.08] text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {m === "score" ? "Builder Score" : m}
          </button>
        ))}
      </div>

      {ranked.length === 0 ? (
        mode === "following" ? (
          <EmptyState
            title="No one here yet"
            message="You're not following anyone yet. Find builders on the Search page."
            actions={onTabChange ? [{ label: "Discover Builders", onClick: () => onTabChange("search"), primary: true }] : []}
          />
        ) : (
          <EmptyState title="No builders yet" message="Be the first to start building!" />
        )
      ) : (
        <>
          {/* Podium */}
          {top3.length >= 1 && (
            <div className="flex items-end justify-center gap-6 mb-10">
              {podiumOrder.map((user, i) => {
                if (!user) return null;
                const displayName = user.display_name || user.username;
                const actualRank = top3.indexOf(user);
                return (
                  <button
                    key={user.id}
                    onClick={() => onUserClick(user.username)}
                    className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <span className="text-2xl">{medals[i]}</span>
                    <Avatar
                      name={displayName}
                      size={podiumSizes[i]}
                      showRing={actualRank === 0}
                    />
                    <span className="text-sm font-semibold text-foreground">{displayName}</span>
                    <span className="text-sm font-mono font-bold text-accent">
                      {formatNumber(getDisplayValue(user))}
                    </span>
                    <span className="text-[10px] text-muted uppercase">{valueLabel}</span>
                    <div
                      className="w-20 rounded-t-lg"
                      style={{
                        height: barHeights[i],
                        background: `linear-gradient(to top, rgba(56, 239, 125, 0.15), rgba(56, 239, 125, 0.03))`,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Table */}
          {rest.length > 0 && (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-[48px_1fr_120px_120px_100px] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted border-b border-border bg-card">
                <span>#</span>
                <span>Builder</span>
                <span className="text-right">{mode === "score" ? "Score" : "Today"}</span>
                <span className="text-right">3mo Total</span>
                <span className="text-right">Streak</span>
              </div>
              {rest.map((user, i) => {
                const displayName = user.display_name || user.username;
                const rank = i + 4;
                return (
                  <button
                    key={user.id}
                    onClick={() => onUserClick(user.username)}
                    className="grid grid-cols-[48px_1fr_120px_120px_100px] w-full items-center px-4 py-3 text-left border-b border-border last:border-b-0 hover:bg-card-hover transition-colors duration-150"
                  >
                    <span className="text-sm text-muted font-mono">{rank}</span>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar name={displayName} size={28} />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{displayName}</div>
                        <div className="text-xs text-muted truncate">@{user.username}</div>
                      </div>
                    </div>
                    <span className="text-right text-sm font-mono font-bold text-accent">
                      {formatNumber(getDisplayValue(user))}
                    </span>
                    <span className="text-right text-sm font-mono text-foreground/60">
                      {formatNumber(user.total_tokens_used)}
                    </span>
                    <span className="text-right text-sm font-mono text-foreground/60">
                      {user.streak_days}d {user.streak_days >= 14 ? "🔥" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Community summary */}
      <div className="mt-8 grid grid-cols-4 rounded-xl border border-border bg-card">
        {[
          { label: "Community Tokens", value: communityStats.tokens, green: true },
          { label: "Active Builders", value: communityStats.builders },
          { label: "Projects Shipped", value: communityStats.shipped },
          { label: "Total Downloads", value: communityStats.downloads },
        ].map((stat) => (
          <div key={stat.label} className="px-4 py-4 text-center">
            <div className={`text-lg font-bold font-mono ${stat.green ? "text-accent" : "text-foreground"}`}>
              {formatNumber(stat.value)}
            </div>
            <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
