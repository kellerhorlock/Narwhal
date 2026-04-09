"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { generateGradientSVG, formatNumber, timeAgo, estimateWorkTime } from "@/lib/helpers";
import Avatar from "./Avatar";
import EditProjectModal from "./EditProjectModal";
import type { Project, Profile } from "@/lib/types";
import { ArrowLeft, ExternalLink, Download, Pencil, Eye, EyeOff } from "lucide-react";

interface ProjectDetailProps {
  project: Project;
  profile: Profile;
  isOwner: boolean;
  onBack: () => void;
  onUserClick: (username: string) => void;
  currentUserId: string;
  allDownloads?: number[];
}

export default function ProjectDetail({ project: initialProject, profile, isOwner, onBack, onUserClick, currentUserId, allDownloads = [] }: ProjectDetailProps) {
  const [project, setProject] = useState(initialProject);
  const [showEdit, setShowEdit] = useState(false);
  const [toggling, setToggling] = useState(false);
  const displayName = profile.display_name || profile.username;
  const hiddenStats = project.hidden_stats || [];

  const estHours = Math.round(project.commits * 0.65);
  const workTimeDisplay = estimateWorkTime(project.commits);

  async function toggleVisibility() {
    setToggling(true);
    const supabase = createClient();
    const newStatus = project.status === "published" ? "stealth" : "published";
    await supabase.from("projects").update({ status: newStatus }).eq("id", project.id);
    setProject((p) => ({ ...p, status: newStatus }));
    setToggling(false);
  }

  // Stats to show (filtered by hidden_stats), with est work time added
  const allStats = [
    { key: "tokens", label: "Tokens Used", value: project.tokens_used, green: true },
    { key: "commits", label: "Commits", value: project.commits },
    { key: "lines_changed", label: "Lines Changed", value: project.lines_changed },
    { key: "est_work_time", label: "Est. Work Time", value: estHours, display: workTimeDisplay },
  ];
  const visibleStats = allStats.filter((s) => !hiddenStats.includes(s.key));

  // AI insights paragraph
  const techStr = (project.tech_stack || []).join(", ");
  const insightParts: string[] = [];

  if (techStr) insightParts.push(`Built with ${techStr} over ${formatNumber(project.commits)} commits.`);
  else if (project.commits > 0) insightParts.push(`Built over ${formatNumber(project.commits)} commits.`);

  if (estHours > 0) insightParts.push(`${estHours} hours of estimated development time.`);

  if (project.tokens_used > 0) insightParts.push(`${formatNumber(project.tokens_used)} AI tokens consumed during development.`);

  if (project.commits > 100) insightParts.push("One of the most actively developed projects on Narwhal.");

  if (project.downloads > 0) insightParts.push(`Downloaded by ${formatNumber(project.downloads)} developers.`);

  const insightText = insightParts.join(" ");

  // Status badge
  const statusLabel = project.status === "published" ? "Published" : project.status === "stealth" ? "Stealth" : "Building";
  const statusColor = project.status === "published" ? "bg-accent/15 text-accent" : project.status === "stealth" ? "bg-white/10 text-white/60" : "bg-blue-500/15 text-blue-400";

  return (
    <div>
      {/* Top row: back + edit */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors duration-150"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        {isOwner && (
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <Pencil size={14} />
            Edit
          </button>
        )}
      </div>

      {/* Hero image */}
      <div
        className="w-full bg-cover bg-center mb-6"
        style={{
          height: 280,
          borderRadius: 20,
          backgroundImage: project.thumbnail_url
            ? `url("${project.thumbnail_url}")`
            : `url("${generateGradientSVG(project.name, 860, 280)}")`,
        }}
      />

      {/* Name + badge + visibility toggle */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <h1 className="text-[30px] font-bold text-foreground">{project.name}</h1>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
          {statusLabel}
        </span>
        {isOwner && (
          <button
            onClick={toggleVisibility}
            disabled={toggling}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:bg-white/5 disabled:opacity-50"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            {project.status === "published" ? (
              <>
                <EyeOff size={14} className="text-muted" />
                <span className="text-muted">Hide</span>
              </>
            ) : (
              <>
                <Eye size={14} style={{ color: "#38ef7d" }} />
                <span style={{ color: "#38ef7d" }}>Publish</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Builder info */}
      <button
        onClick={() => onUserClick(profile.username)}
        className="flex items-center gap-2.5 mb-5 hover:opacity-80 transition-opacity"
      >
        <Avatar name={displayName} size={28} />
        <span className="text-sm font-medium text-foreground">{displayName}</span>
        <span className="text-sm text-muted">@{profile.username}</span>
        {project.created_at && (
          <span className="text-sm text-muted">· Created {timeAgo(project.created_at)}</span>
        )}
      </button>

      {/* Description */}
      <p className="text-[16px] text-foreground/70 mb-6 max-w-[640px]" style={{ lineHeight: 1.7 }}>
        {project.description || "No description yet."}
      </p>

      {/* Action buttons */}
      {(project.landing_url || project.download_url) && (
        <div className="flex gap-3 mb-6">
          {project.landing_url && (
            <a
              href={project.landing_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
              style={{ background: "var(--accent-green)" }}
            >
              Visit Project
              <ExternalLink size={14} />
            </a>
          )}
          {project.download_url && (
            <a
              href={project.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              Download
              <Download size={14} />
            </a>
          )}
        </div>
      )}

      {/* Stats grid */}
      {visibleStats.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {visibleStats.map((stat) => (
            <div key={stat.key} className="rounded-xl border bg-card px-5 py-3.5 text-center" style={{ borderColor: "var(--border-subtle)" }}>
              <div className={`text-[20px] font-bold font-mono ${stat.green ? "text-accent" : "text-foreground"}`}>
                {stat.display ? stat.display : (stat.value ? formatNumber(stat.value) : "\u2014")}
              </div>
              <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tech stack */}
      {(project.tech_stack || []).length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Built with</h3>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span key={tech} className="rounded-full border bg-card px-3.5 py-1.5 text-sm font-mono text-foreground/70" style={{ borderColor: "var(--border-subtle)" }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insightText && (
        <div className="rounded-xl border bg-card p-5 mb-6" style={{ borderColor: "var(--border-subtle)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">AI Insights</h3>
          <p className="text-sm text-foreground/70 leading-relaxed">{insightText}</p>
        </div>
      )}

      {/* Last active */}
      <div className="flex gap-4 text-xs text-muted">
        {project.last_activity && (
          <span>Last active {timeAgo(project.last_activity)}</span>
        )}
      </div>

      {/* Edit modal */}
      {showEdit && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => {
            setProject(updated);
            setShowEdit(false);
          }}
        />
      )}
    </div>
  );
}
