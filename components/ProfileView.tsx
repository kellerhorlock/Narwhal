"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { timeAgo, calculateBuilderScore, getPercentile, formatNumber, deriveStats } from "@/lib/helpers";
import Avatar from "./Avatar";
import BuilderScoreBadge from "./BuilderScoreBadge";
import HumanMachineStats from "./HumanMachineStats";
import WeeklyDropCard from "./WeeklyDropCard";
import ProjectCard from "./ProjectCard";
import ContextMenu from "./ContextMenu";
import EditProjectModal from "./EditProjectModal";
import EmptyState from "./EmptyState";
import FollowListModal from "./FollowListModal";
import NarwhalIcon from "./NarwhalIcon";
import type { Profile, Project } from "@/lib/types";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileViewProps {
  username?: string;
  currentUserId: string;
  onProjectClick: (project: Project) => void;
  onTabChange?: (tab: string) => void;
}

function safeNum(v: unknown): number {
  if (v === null || v === undefined) return 0;
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

export default function ProfileView({ username, currentUserId, onProjectClick, onTabChange }: ProfileViewProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allScores, setAllScores] = useState<number[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = !username;

  const [followListMode, setFollowListMode] = useState<"followers" | "following" | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; project: Project } | null>(null);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();

      let profileQuery = supabase.from("profiles").select("*");
      if (username) {
        profileQuery = profileQuery.eq("username", username);
      } else {
        profileQuery = profileQuery.eq("id", currentUserId);
      }
      const { data: profileData } = await profileQuery.single();
      if (!profileData) { setLoading(false); return; }
      setProfile(profileData);

      const profileId = profileData.id;

      let projectQuery = supabase.from("projects").select("*").eq("user_id", profileId).order("last_activity", { ascending: false });
      if (!isOwnProfile && profileId !== currentUserId) {
        projectQuery = projectQuery.eq("status", "published");
      }
      const { data: projectData } = await projectQuery;
      setProjects(projectData || []);

      const { data: allUsers } = await supabase.from("profiles").select("id, streak_days, hours_this_month");
      const { data: allProjects } = await supabase.from("projects").select("user_id, status, downloads, commits");

      if (allUsers && allProjects) {
        const scores = allUsers.map((u) => {
          const userProjs = allProjects.filter((p) => p.user_id === u.id);
          const pub = userProjs.filter((p) => p.status === "published").length;
          const dl = userProjs.reduce((s, p) => s + safeNum(p.downloads), 0);
          const totalCommits = userProjs.reduce((s, p) => s + safeNum(p.commits), 0);
          return calculateBuilderScore(totalCommits * 14777, pub, dl, safeNum(u.streak_days), safeNum(u.hours_this_month)).total;
        });
        setAllScores(scores);
      }

      const [{ count: followers }, { count: following }] = await Promise.all([
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", profileId),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", profileId),
      ]);
      setFollowerCount(followers || 0);
      setFollowingCount(following || 0);

      if (!isOwnProfile && profileId !== currentUserId) {
        const { data: followData } = await supabase
          .from("follows")
          .select("id")
          .eq("follower_id", currentUserId)
          .eq("following_id", profileId)
          .maybeSingle();
        setIsFollowing(!!followData);
      }

      setLoading(false);
    }
    load();
  }, [username, currentUserId, isOwnProfile]);

  async function toggleFollow() {
    if (!profile) return;
    const supabase = createClient();
    if (isFollowing) {
      await supabase.from("follows").delete().eq("follower_id", currentUserId).eq("following_id", profile.id);
      setIsFollowing(false);
      setFollowerCount((c) => c - 1);
    } else {
      await supabase.from("follows").insert({ follower_id: currentUserId, following_id: profile.id });
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  function handleContextMenu(e: React.MouseEvent, project: Project) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, project });
  }

  function handleMenuClick(e: React.MouseEvent, project: Project) {
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, project });
  }

  async function handlePublish(project: Project) {
    const supabase = createClient();
    await supabase.from("projects").update({ status: "published" }).eq("id", project.id);
    setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, status: "published" } : p));
  }

  async function handleMoveToStealth(project: Project) {
    const supabase = createClient();
    await supabase.from("projects").update({ status: "stealth" }).eq("id", project.id);
    setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, status: "stealth" } : p));
  }

  async function handleDelete(project: Project) {
    const supabase = createClient();
    await supabase.from("projects").delete().eq("id", project.id);
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    setDeleteProject(null);
  }

  function handleProjectSaved(updated: Project) {
    setProjects((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    setEditProject(null);
  }

  if (loading) {
    return <div className="py-20 flex justify-center"><NarwhalIcon size={40} style={{ color: "var(--text-muted)" }} animate="pulse" /></div>;
  }

  if (!profile) {
    return <div className="py-20 text-center text-sm" style={{ color: "var(--text-secondary)" }}>User not found</div>;
  }

  const displayName = profile.display_name || profile.username;
  const streakDays = safeNum(profile.streak_days);
  const launchedCount = projects.filter((p) => p.status === "published").length;
  const totalDownloads = projects.reduce((sum, p) => sum + safeNum(p.downloads), 0);
  const totalCommits = projects.reduce((sum, p) => sum + safeNum(p.commits), 0);
  const totalTokens = totalCommits * 14777;
  const monthsSinceJoined = Math.max(1, Math.ceil((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)));
  const hoursPerMonth = Math.round((totalCommits * 0.47) / monthsSinceJoined);
  const score = calculateBuilderScore(totalTokens, launchedCount, totalDownloads, streakDays, hoursPerMonth);
  const percentile = getPercentile(score.total, allScores);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-5 mb-6">
        <Avatar name={displayName} size={72} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-[28px] font-semibold" style={{ color: "var(--text-primary)" }}>{displayName}</h2>
            <BuilderScoreBadge score={score.total} percentile={percentile} size="lg" />
            {streakDays >= 7 && (
              <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--accent-warm)" }}>
                {streakDays}d
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1">
            <span className="text-[14px] font-mono" style={{ color: "var(--text-secondary)" }}>@{profile.username}</span>
            {profile.created_at && (
              <span className="text-[13px]" style={{ color: "var(--text-muted)" }}> · Joined {timeAgo(profile.created_at)}</span>
            )}
          </div>
          {profile.bio && (
            <p className="text-[14px] mt-2 max-w-[480px]" style={{ lineHeight: 1.6, color: "var(--text-secondary)" }}>{profile.bio}</p>
          )}
        </div>
        <div className="flex gap-2">
          {!isOwnProfile && profile.id !== currentUserId && (
            <button
              onClick={toggleFollow}
              className="rounded-full px-5 py-2 text-[13px] font-semibold transition-colors duration-150"
              style={isFollowing
                ? { border: "1px solid var(--border-default)", color: "var(--text-primary)" }
                : { background: "var(--accent-primary)", color: "var(--text-inverse)" }
              }
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm transition-colors duration-150"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              <LogOut size={14} />
              Log Out
            </button>
          )}
        </div>
      </div>

      {/* Human vs Machine stats */}
      <HumanMachineStats
        totalCommits={totalCommits}
        projectCount={projects.length}
        launchedCount={launchedCount}
        followerCount={followerCount}
        followingCount={followingCount}
        createdAt={profile.created_at}
        onFollowersClick={() => setFollowListMode("followers")}
        onFollowingClick={() => setFollowListMode("following")}
      />

      {/* Weekly drop card */}
      {projects.length > 0 && (
        <div className="mt-4">
          <WeeklyDropCard projects={projects} followerDelta={0} />
        </div>
      )}

      {/* Projects */}
      <div className="mt-8">
        <h3 className="text-[11px] font-medium uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>Projects</h3>
        {projects.length === 0 ? (
          isOwnProfile ? (
            <EmptyState
              title="No projects yet"
              message="Set up the Narwhal agent to auto-sync your work, or add a project manually."
              actions={[
                ...(onTabChange ? [{ label: "Setup Agent", onClick: () => onTabChange("setup"), primary: true }] : []),
                ...(onTabChange ? [{ label: "Add Manually", onClick: () => onTabChange("setup") }] : []),
              ]}
            />
          ) : (
            <EmptyState
              title="No projects yet"
              message={`${displayName} hasn't published any projects yet.`}
            />
          )
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                height={200}
                isStealth={project.status === "stealth"}
                onClick={() => onProjectClick(project)}
                onContextMenu={isOwnProfile ? (e) => handleContextMenu(e, project) : undefined}
                showMenuButton={isOwnProfile}
                onMenuClick={isOwnProfile ? (e) => handleMenuClick(e, project) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          isPublished={contextMenu.project.status === "published"}
          onPublish={() => handlePublish(contextMenu.project)}
          onMoveToStealth={() => handleMoveToStealth(contextMenu.project)}
          onEdit={() => {
            setEditProject(contextMenu.project);
            setContextMenu(null);
          }}
          onDelete={() => {
            setDeleteProject(contextMenu.project);
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />
      )}

      {editProject && (
        <EditProjectModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onSaved={handleProjectSaved}
        />
      )}

      {followListMode && profile && (
        <FollowListModal
          profileId={profile.id}
          mode={followListMode}
          onClose={() => setFollowListMode(null)}
          onUserClick={(u) => router.push(`/user/${u}`)}
        />
      )}

      {deleteProject && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          style={{ background: "rgba(15, 23, 42, 0.4)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteProject(null); }}
        >
          <div className="rounded-2xl p-6 max-w-[380px] w-full" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-lg)" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Delete Project</h3>
            <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to delete <strong style={{ color: "var(--text-primary)" }}>{deleteProject.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteProject)}
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-colors"
                style={{ background: "var(--accent-danger)" }}
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteProject(null)}
                className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors"
                style={{ border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
