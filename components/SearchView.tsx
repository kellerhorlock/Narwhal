"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { formatNumber } from "@/lib/helpers";
import Avatar from "./Avatar";
import ProjectCard from "./ProjectCard";
import EmptyState from "./EmptyState";
import NarwhalIcon from "./NarwhalIcon";
import type { Profile, Project } from "@/lib/types";
import { Search as SearchIcon } from "lucide-react";

const POPULAR_TAGS = ["React", "Claude API", "Supabase", "Python", "Next.js", "Three.js", "Rust"];

interface SearchViewProps {
  onProjectClick: (project: Project) => void;
  onUserClick: (username: string) => void;
}

export default function SearchView({ onProjectClick, onUserClick }: SearchViewProps) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"users" | "projects">("users");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<{ user_id: string; commits: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: usersData }, { data: projectsData }, { data: allProjectsData }] = await Promise.all([
        supabase.from("profiles").select("*").order("total_tokens_used", { ascending: false }),
        supabase.from("projects").select("*").eq("status", "published").order("last_activity", { ascending: false }),
        supabase.from("projects").select("user_id, commits"),
      ]);
      setUsers(usersData || []);
      setProjects(projectsData || []);
      setAllProjects(allProjectsData || []);
      setLoading(false);
    }
    load();
  }, []);

  const userStats = useMemo(() => {
    const stats: Record<string, { projectCount: number; totalCommits: number }> = {};
    for (const p of allProjects) {
      if (!stats[p.user_id]) stats[p.user_id] = { projectCount: 0, totalCommits: 0 };
      stats[p.user_id].projectCount++;
      stats[p.user_id].totalCommits += p.commits || 0;
    }
    return stats;
  }, [allProjects]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tag of POPULAR_TAGS) {
      counts[tag] = projects.filter((p) =>
        (p.tech_stack || []).some((t) => t.toLowerCase() === tag.toLowerCase())
      ).length;
    }
    return counts;
  }, [projects]);

  const q = query.toLowerCase();
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(q) ||
      (u.display_name || "").toLowerCase().includes(q)
  );

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (activeTag) {
      result = result.filter((p) =>
        (p.tech_stack || []).some((t) => t.toLowerCase() === activeTag.toLowerCase())
      );
    }
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.tech_stack || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [projects, activeTag, q]);

  function handleTagClick(tag: string) {
    setActiveTag(activeTag === tag ? null : tag);
  }

  return (
    <div>
      <h1 className="font-serif italic mb-3" style={{ fontSize: 36, color: "var(--text-primary)" }}>Search</h1>
      <p className="mb-6 text-[14px]" style={{ color: "var(--text-muted)" }}>Find builders and projects</p>

      {/* Search input */}
      <div className="relative max-w-[480px] mb-5">
        <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl pl-10 pr-4 py-2.5 text-[15px] outline-none transition-colors duration-150"
          style={{ background: "var(--bg-input)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
        />
      </div>

      {/* Toggle */}
      <div className="flex max-w-[240px] rounded-lg p-1 mb-6" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)" }}>
        {(["users", "projects"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setActiveTag(null); }}
            className="flex-1 rounded-md px-4 py-1.5 text-[12px] font-semibold capitalize transition-colors duration-150"
            style={{
              background: mode === m ? "var(--accent-primary)" : undefined,
              color: mode === m ? "var(--text-inverse)" : "var(--text-secondary)",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><NarwhalIcon size={40} style={{ color: "var(--text-muted)" }} animate="pulse" /></div>
      ) : mode === "users" ? (
        filteredUsers.length === 0 ? (
          <EmptyState
            title={q ? `No results for "${query}"` : "No users found"}
            message={q ? "Try a different search term." : "No builders have signed up yet."}
          />
        ) : (
          <div className="flex flex-col gap-1">
            {filteredUsers.map((user) => {
              const displayName = user.display_name || user.username;
              const stats = userStats[user.id];
              const projectCount = stats?.projectCount || 0;
              const totalCommits = stats?.totalCommits || 0;
              return (
                <button
                  key={user.id}
                  onClick={() => onUserClick(user.username)}
                  className="flex items-center gap-3.5 rounded-xl px-4 py-3 transition-colors duration-150 text-left"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                >
                  <Avatar name={displayName} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{displayName}</span>
                      {user.streak_days >= 7 && (
                        <span className="text-xs rounded-full px-2 py-0.5" style={{ background: "#fff7ed", color: "var(--accent-warm)" }}>{user.streak_days}d</span>
                      )}
                    </div>
                    <div className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                      @{user.username} · {projectCount} project{projectCount !== 1 ? "s" : ""} · {formatNumber(totalCommits)} commits
                    </div>
                  </div>
                  <span className="text-sm font-mono font-semibold" style={{ color: "var(--accent-primary)" }}>
                    {formatNumber(user.total_tokens_used)}
                  </span>
                </button>
              );
            })}
          </div>
        )
      ) : (
        <div>
          {/* Tech stack tags */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none">
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-150"
                style={activeTag === tag
                  ? { background: "var(--accent-primary-light)", color: "var(--accent-primary)", border: "1px solid rgba(255,0,131,0.2)" }
                  : { border: "1px solid var(--border-default)", color: "var(--text-secondary)" }
                }
              >
                {tag}{tagCounts[tag] > 0 ? ` (${tagCounts[tag]})` : ""}
              </button>
            ))}
          </div>

          {activeTag && (
            <div className="mb-4">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Projects built with {activeTag}</h2>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}</p>
            </div>
          )}

          {filteredProjects.length === 0 ? (
            <EmptyState
              title={q ? `No results for "${query}"` : activeTag ? `No projects using ${activeTag}` : "No projects found"}
              message="Try a different search term or filter."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onProjectClick(project)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
