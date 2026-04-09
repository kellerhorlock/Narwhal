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
import type { Profile, Project } from "@/lib/types";
import NarwhalIcon from "./NarwhalIcon";
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

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; project: Project } | null>(null);
  // Edit modal state
  const [editProject, setEditProject] = useState<Project | null>(null);
  // Delete confirmation state
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
          return calculateBuilderScore(totalCommits * 25000, pub, dl, safeNum(u.streak_days), safeNum(u.hours_this_month)).total;
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

  // Context menu handlers
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
    return <div className="py-20 flex justify-center"><NarwhalIcon size={40} className="text-muted" animate="pulse" /></div>;
  }

  if (!profile) {
    return <div className="text-muted py-20 text-center">User not found</div>;
  }

  const displayName = profile.display_name || profile.username;
  const streakDays = safeNum(profile.streak_days);
  const showStreakBadge = streakDays >= 7;
  const showRing = streakDays >= 14;
  const launchedCount = projects.filter((p) => p.status === "published").length;
  const totalDownloads = projects.reduce((sum, p) => sum + safeNum(p.downloads), 0);

  // Compute real stats from project data
  const totalCommits = projects.reduce((sum, p) => sum + safeNum(p.commits), 0);
  const totalTokens = totalCommits * 25000;

  // Hours/mo: total commits * 0.65 / months since joined (min 1)
  const monthsSinceJoined = Math.max(1, Math.ceil((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24 * 30)));
  const hoursPerMonth = Math.round((totalCommits * 0.65) / monthsSinceJoined);

  const score = calculateBuilderScore(totalTokens, launchedCount, totalDownloads, streakDays, hoursPerMonth);
  const percentile = getPercentile(score.total, allScores);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-5 mb-6">
        <Avatar name={displayName} size={80} showRing={showRing} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-[28px] font-bold text-foreground">{displayName}</h2>
            <BuilderScoreBadge score={score.total} percentile={percentile} size="lg" />
            {showStreakBadge && (
              <span className="rounded-full bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-400">
                {streakDays}d
              </span>
            )}
          </div>
          <div className="text-sm text-muted mt-0.5">
            @{profile.username}{profile.created_at ? ` · Joined ${timeAgo(profile.created_at)}` : ""}
          </div>
          {profile.bio && <p className="text-sm text-foreground/70 mt-2 max-w-lg">{profile.bio}</p>}
        </div>
        <div className="flex gap-2">
          {!isOwnProfile && profile.id !== currentUserId && (
            <button
              onClick={toggleFollow}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-150 ${
                isFollowing
                  ? "border text-foreground hover:border-muted"
                  : "bg-white text-black hover:opacity-80"
              }`}
              style={isFollowing ? { borderColor: "var(--border-subtle)" } : undefined}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors duration-150"
              style={{ border: "1px solid var(--border-subtle)" }}
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
      />

      {/* Weekly drop card */}
      {projects.length > 0 && (
        <div className="mt-6">
          <WeeklyDropCard projects={projects} followerDelta={0} />
        </div>
      )}

      {/* Projects */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Projects</h3>
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
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
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

      {/* Edit modal */}
      {editProject && (
        <EditProjectModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onSaved={handleProjectSaved}
        />
      )}

      {/* Delete confirmation */}
      {deleteProject && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteProject(null); }}
        >
          <div
            className="rounded-2xl border p-6 max-w-[380px] w-full"
            style={{ background: "var(--bg-primary)", borderColor: "var(--border-subtle)" }}
          >
            <h3 className="text-lg font-bold text-foreground mb-2">Delete Project</h3>
            <p className="text-sm text-foreground/60 mb-5">
              Are you sure you want to delete <strong className="text-foreground">{deleteProject.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteProject)}
                className="flex-1 rounded-lg bg-red-500/90 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteProject(null)}
                className="flex-1 rounded-lg border py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                style={{ borderColor: "var(--border-subtle)" }}
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
