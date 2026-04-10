"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import FeedItem from "@/components/FeedItem";
import NewsCard from "@/components/NewsCard";
import DailyBriefing from "@/components/DailyBriefing";
import EmptyState from "@/components/EmptyState";
import ProjectDetail from "@/components/ProjectDetail";
import ProfileView from "@/components/ProfileView";
import SearchView from "@/components/SearchView";
import LeaderboardView from "@/components/LeaderboardView";
import SetupView from "@/components/SetupView";
import NarwhalIcon from "@/components/NarwhalIcon";
import { newsFeed as fallbackNews } from "@/lib/ai-news-feed";
import type { NewsEntry } from "@/lib/ai-news-feed";
import type { Profile, Project } from "@/lib/types";
import { Star } from "lucide-react";
import Avatar from "@/components/Avatar";
import ProjectCard from "@/components/ProjectCard";
import { timeAgo } from "@/lib/helpers";

type Tab = "feed" | "search" | "leaderboard" | "profile" | "setup";
type FeedFilter = "all" | "following";

interface ViewState {
  tab: Tab;
  projectDetail?: { project: Project; profile: Profile };
  viewUsername?: string;
}

type FeedEntry =
  | { kind: "project"; project: Project & { profiles: Profile } }
  | { kind: "featured"; project: Project & { profiles: Profile } }
  | { kind: "news"; entry: NewsEntry };

export default function FeedPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<ViewState>({ tab: "feed" });
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("all");
  const [feedProjects, setFeedProjects] = useState<(Project & { profiles: Profile })[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<(Project & { profiles: Profile })[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [allDownloads, setAllDownloads] = useState<number[]>([]);
  const [userPublishedCount, setUserPublishedCount] = useState(0);
  const [userTotalDownloads, setUserTotalDownloads] = useState(0);
  const [userEstimatedTokens, setUserEstimatedTokens] = useState(0);
  const [newsEntries, setNewsEntries] = useState<NewsEntry[]>(fallbackNews);
  const [followingProjects, setFollowingProjects] = useState<(Project & { profiles: Profile })[]>([]);
  const [feedLoading, setFeedLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setNewsEntries(data as NewsEntry[]);
          }
        }
      } catch { /* Fallback already set */ }
    }
    loadNews();
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setCurrentUserId(user.id);

      const [{ data: profile }, { count: projectCount }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      if (projectCount === 0) {
        setCurrentUser(profile);
        setLoading(false);
        setView({ tab: "setup" });
        return;
      }

      setCurrentUser(profile);
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!currentUserId) return;
    async function loadFeed() {
      setFeedLoading(true);
      const supabase = createClient();

      const [{ data: projectsData }, { data: usersData }, { data: userProjects }, { data: topProjects }] = await Promise.all([
        supabase
          .from("projects")
          .select("*, profiles(*)")
          .eq("status", "published")
          .order("last_activity", { ascending: false })
          .limit(50),
        supabase.from("profiles").select("*").order("tokens_today", { ascending: false }),
        supabase.from("projects").select("status, downloads, user_id, commits"),
        supabase
          .from("projects")
          .select("*, profiles(*)")
          .eq("status", "published")
          .order("downloads", { ascending: false })
          .limit(6),
      ]);

      setFeedProjects((projectsData || []) as (Project & { profiles: Profile })[]);
      setFeaturedProjects((topProjects || []) as (Project & { profiles: Profile })[]);
      setAllUsers(usersData || []);

      const myProjects = (userProjects || []).filter((p) => p.user_id === currentUserId);
      setUserPublishedCount(myProjects.filter((p) => p.status === "published").length);
      setUserTotalDownloads(myProjects.reduce((s, p) => s + (p.downloads || 0), 0));
      setUserEstimatedTokens(myProjects.reduce((s, p) => s + (p.commits || 0) * 14777, 0));
      setAllDownloads((userProjects || []).map((p) => p.downloads || 0));

      // Load following feed: all activity from followed users (last 7 days, not stealth)
      const { data: followRows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", currentUserId);

      if (followRows && followRows.length > 0) {
        const followedIds = followRows.map((f) => f.following_id);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data: followedProjects } = await supabase
          .from("projects")
          .select("*, profiles(*)")
          .in("user_id", followedIds)
          .neq("status", "stealth")
          .gte("last_activity", sevenDaysAgo)
          .order("last_activity", { ascending: false });
        setFollowingProjects((followedProjects || []) as (Project & { profiles: Profile })[]);
      } else {
        setFollowingProjects([]);
      }

      setFeedLoading(false);
    }
    loadFeed();
  }, [currentUserId]);

  const mergedFeed = useMemo((): FeedEntry[] => {
    if (feedFilter === "following") {
      return followingProjects.map((p) => ({ kind: "project" as const, project: p }));
    }

    const hasProjects = feedProjects.length > 0;
    const entries: FeedEntry[] = [];

    if (hasProjects) {
      let newsIndex = 0;
      for (let i = 0; i < feedProjects.length; i++) {
        entries.push({ kind: "project", project: feedProjects[i] });
        if ((i + 1) % 2 === 0 && newsIndex < newsEntries.length) {
          entries.push({ kind: "news", entry: newsEntries[newsIndex] });
          newsIndex++;
        }
      }
      while (newsIndex < newsEntries.length) {
        entries.push({ kind: "news", entry: newsEntries[newsIndex] });
        newsIndex++;
      }
    } else {
      let featIndex = 0;
      for (let i = 0; i < newsEntries.length; i++) {
        entries.push({ kind: "news", entry: newsEntries[i] });
        if ((i + 1) % 3 === 0 && featIndex < featuredProjects.length) {
          entries.push({ kind: "featured", project: featuredProjects[featIndex] });
          featIndex++;
        }
      }
    }

    return entries;
  }, [feedProjects, followingProjects, featuredProjects, feedFilter, newsEntries]);

  const handleTabChange = useCallback((tab: string) => {
    setView({ tab: tab as Tab });
  }, []);

  const handleProjectClick = useCallback(async (project: Project) => {
    let profile = (project as Project & { profiles?: Profile }).profiles;
    if (!profile) {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", project.user_id)
        .single();
      profile = data;
    }
    if (profile) {
      setView((v) => ({ ...v, projectDetail: { project, profile: profile! } }));
    }
  }, []);

  const handleUserClick = useCallback((username: string) => {
    setView({ tab: "profile", viewUsername: username });
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setView((v) => ({ ...v, projectDetail: undefined }));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <NarwhalIcon size={40} style={{ color: "var(--text-muted)" }} animate="pulse" />
      </div>
    );
  }

  const showingDetail = !!view.projectDetail;

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={view.tab}
          onTabChange={handleTabChange}
          profile={currentUser}
          publishedCount={userPublishedCount}
          totalDownloads={userTotalDownloads}
          estimatedTokens={userEstimatedTokens}
          feedProjects={feedProjects}
        />
      </div>

      <main className="md:ml-[240px] flex-1 overflow-y-auto min-h-screen pb-20 md:pb-0">
        <div className="mx-auto max-w-[860px] px-4 py-6 md:px-[52px] md:py-[44px]">
          {showingDetail ? (
            <ProjectDetail
              project={view.projectDetail!.project}
              profile={view.projectDetail!.profile}
              isOwner={view.projectDetail!.project.user_id === currentUserId}
              onBack={handleBackFromDetail}
              onUserClick={handleUserClick}
              currentUserId={currentUserId}
              allDownloads={allDownloads}
            />
          ) : view.tab === "feed" ? (
            <div>
              <h1 className="font-serif italic mb-3" style={{ fontSize: 36, color: "var(--text-primary)" }}>For You</h1>
              <p className="mb-6 text-[14px]" style={{ color: "var(--text-secondary)" }}>What builders are shipping right now</p>

              {/* Feed filter tabs */}
              <div className="flex gap-1 mb-8 rounded-lg p-1" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", width: "fit-content" }}>
                <button
                  onClick={() => setFeedFilter("all")}
                  className="rounded-md px-4 py-1.5 text-[12px] font-medium transition-colors duration-150"
                  style={{
                    background: feedFilter === "all" ? "var(--accent-primary)" : undefined,
                    color: feedFilter === "all" ? "var(--text-inverse)" : "var(--text-secondary)",
                  }}
                >
                  All
                </button>
                <button
                  onClick={() => setFeedFilter("following")}
                  className="rounded-md px-4 py-1.5 text-[12px] font-medium transition-colors duration-150"
                  style={{
                    background: feedFilter === "following" ? "var(--accent-primary)" : undefined,
                    color: feedFilter === "following" ? "var(--text-inverse)" : "var(--text-secondary)",
                  }}
                >
                  Following
                </button>
              </div>

              {/* Daily Briefing */}
              {currentUser && !feedLoading && (
                <DailyBriefing
                  currentUser={currentUser}
                  feedProjects={feedProjects}
                  allUsers={allUsers}
                  trendingNews={newsEntries[0]}
                />
              )}

              <div className="h-6" />

              {feedLoading ? (
                <div className="py-16 flex justify-center"><NarwhalIcon size={40} style={{ color: "var(--text-muted)" }} animate="pulse" /></div>
              ) : mergedFeed.length === 0 ? (
                <EmptyState
                  title="Your feed is empty"
                  message="Follow some builders and watch this fill up with inspiration."
                  actions={[
                    { label: "Discover Builders", onClick: () => handleTabChange("search"), primary: true },
                    { label: "Setup Agent", onClick: () => handleTabChange("setup") },
                  ]}
                />
              ) : (
                <div className="flex flex-col gap-6">
                  {mergedFeed.map((item, idx) => {
                    if (item.kind === "news") {
                      return <NewsCard key={item.entry.id} entry={item.entry} />;
                    }
                    if (item.kind === "featured") {
                      const profile = item.project.profiles;
                      const displayName = profile.display_name || profile.username;
                      return (
                        <div key={`feat-${item.project.id}`}>
                          <div className="mb-3 flex items-center gap-2.5">
                            <Star size={14} style={{ color: "var(--accent-primary)" }} />
                            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-primary)" }}>Featured Builder</span>
                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>·</span>
                            <button
                              onClick={() => handleUserClick(profile.username)}
                              className="flex items-center gap-1.5"
                            >
                              <Avatar name={displayName} size={20} />
                              <span className="text-sm font-medium hover:underline" style={{ color: "var(--text-primary)" }}>{displayName}</span>
                            </button>
                            <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>{timeAgo(item.project.last_activity)}</span>
                          </div>
                          <ProjectCard
                            project={item.project}
                            onClick={() => handleProjectClick(item.project)}
                          />
                        </div>
                      );
                    }
                    return (
                      <FeedItem
                        key={item.project.id}
                        project={item.project}
                        profile={item.project.profiles}
                        onProjectClick={handleProjectClick}
                        onUserClick={handleUserClick}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ) : view.tab === "search" ? (
            <SearchView
              onProjectClick={handleProjectClick}
              onUserClick={handleUserClick}
            />
          ) : view.tab === "leaderboard" ? (
            <LeaderboardView
              currentUserId={currentUserId}
              onUserClick={handleUserClick}
              onTabChange={handleTabChange}
            />
          ) : view.tab === "profile" ? (
            <ProfileView
              username={view.viewUsername}
              currentUserId={currentUserId}
              onProjectClick={handleProjectClick}
              onTabChange={handleTabChange}
            />
          ) : view.tab === "setup" ? (
            <SetupView userId={currentUserId} />
          ) : null}
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <MobileTabBar activeTab={view.tab} onTabChange={handleTabChange} />
    </div>
  );
}

function MobileTabBar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const tabs = [
    { id: "profile", label: "Profile", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    )},
    { id: "feed", label: "For You", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    )},
    { id: "leaderboard", label: "Board", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
    )},
    { id: "search", label: "Search", icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    )},
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t"
      style={{
        background: "rgba(248, 250, 251, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "var(--border-default)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors"
            style={{ color: active ? "var(--accent-primary)" : "var(--text-muted)" }}
          >
            {tab.icon}
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
