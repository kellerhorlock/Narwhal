"use client";

import { useState } from "react";
import { generateGradientSVG, formatNumber, timeAgo } from "@/lib/helpers";
import Avatar from "./Avatar";
import EditProjectModal from "./EditProjectModal";
import type { Project, Profile } from "@/lib/types";
import { ArrowLeft, ExternalLink, Download, Pencil } from "lucide-react";

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
  const displayName = profile.display_name || profile.username;
  const hiddenStats = project.hidden_stats || [];

  const isLaunched = project.status === "published";

  const heroImage = project.thumbnail_url || generateGradientSVG(project.name, 860, 300);

  // Stats to show (filtered by hidden_stats)
  const allStats = [
    { key: "tokens", label: "Tokens Used", value: project.tokens_used, green: true },
    { key: "commits", label: "Commits", value: project.commits },
    { key: "lines_changed", label: "Lines Changed", value: project.lines_changed },
    { key: "downloads", label: "Downloads", value: project.downloads },
  ];
  const visibleStats = allStats.filter((s) => !hiddenStats.includes(s.key));

  // "How it was built" paragraph
  const techStr = (project.tech_stack || []).join(", ");
  const tokensPerCommit = project.commits > 0 ? Math.round(project.tokens_used / project.commits) : 0;

  let insightParts: string[] = [];
  if (techStr) insightParts.push(`Built with ${techStr}`);
  if (project.commits > 0) insightParts.push(`over ${formatNumber(project.commits)} commits`);
  let insightText = insightParts.join(" ");
  if (insightText) insightText += ".";
  if (project.tokens_used > 0) {
    insightText += ` ${formatNumber(project.tokens_used)} tokens consumed during development`;
    if (tokensPerCommit > 0) insightText += `, averaging ${formatNumber(tokensPerCommit)} per commit`;
    insightText += ".";
  }

  let insightExtra = "";
  if (project.downloads > 100) {
    insightExtra = "One of the most downloaded projects on Narwhal.";
  } else if (project.commits > 200) {
    insightExtra = "One of the most actively developed projects on the platform.";
  }

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
        className="w-full rounded-2xl bg-cover bg-center mb-6"
        style={{
          height: 300,
          backgroundImage: project.thumbnail_url
            ? `url("${project.thumbnail_url}")`
            : `url("${generateGradientSVG(project.name, 860, 300)}")`,
        }}
      />

      {/* Name + badge */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <h1 className="text-[28px] font-bold text-foreground">{project.name}</h1>
        {isLaunched ? (
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
            Launched
          </span>
        ) : (
          <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-400">
            Building
          </span>
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
      </button>

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

      {/* Description */}
      {project.description && (
        <p className="text-[16px] text-foreground/70 mb-6 max-w-[600px]" style={{ lineHeight: 1.7 }}>
          {project.description}
        </p>
      )}

      {/* Stats */}
      {visibleStats.length > 0 && (
        <div className="flex gap-4 mb-6 flex-wrap">
          {visibleStats.map((stat) => (
            <div key={stat.key} className="rounded-xl border bg-card px-5 py-3.5 text-center min-w-[120px]" style={{ borderColor: "var(--border-subtle)" }}>
              <div className={`text-[20px] font-bold font-mono ${stat.green ? "text-accent" : "text-foreground"}`}>
                {formatNumber(stat.value)}
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
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span key={tech} className="rounded-full border bg-card px-3.5 py-1.5 text-sm text-foreground/70" style={{ borderColor: "var(--border-subtle)" }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* How it was built */}
      {insightText && (
        <div className="rounded-xl border bg-card p-5 mb-6" style={{ borderColor: "var(--border-subtle)" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">How it was built</h3>
          <p className="text-sm text-foreground/70 leading-relaxed">{insightText}</p>
          {insightExtra && (
            <p className="text-sm text-accent/80 font-medium mt-2">{insightExtra}</p>
          )}
        </div>
      )}

      {/* Timestamps */}
      <div className="flex gap-4 text-xs text-muted">
        {project.created_at && (
          <span>Created {new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        )}
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
