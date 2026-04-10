"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { generateGradientSVG, formatNumber, timeAgo, deriveStats, formatTokens } from "@/lib/helpers";
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

  const stats = deriveStats(project.commits);

  async function toggleVisibility() {
    setToggling(true);
    const supabase = createClient();
    const newStatus = project.status === "published" ? "stealth" : "published";
    await supabase.from("projects").update({ status: newStatus }).eq("id", project.id);
    setProject((p) => ({ ...p, status: newStatus }));
    setToggling(false);
  }

  const allStats = [
    { key: "tokens", label: "Tokens", value: stats.tokens, display: formatTokens(project.commits), green: true },
    { key: "commits", label: "Commits", value: project.commits },
    { key: "lines_changed", label: "Est. Lines", value: stats.linesOfCode },
    { key: "est_work_time", label: "Est. Hours", value: stats.hoursBuilding, display: `${stats.hoursBuilding}h` },
  ];
  const visibleStats = allStats.filter((s) => !hiddenStats.includes(s.key));

  const techStr = (project.tech_stack || []).join(", ");
  const insightParts: string[] = [];
  if (techStr) insightParts.push(`Built with ${techStr} over ${formatNumber(project.commits)} commits.`);
  else if (project.commits > 0) insightParts.push(`Built over ${formatNumber(project.commits)} commits.`);
  if (stats.hoursBuilding > 0) insightParts.push(`~${stats.hoursBuilding} hours of estimated development time.`);
  if (stats.tokens > 0) insightParts.push(`~${formatTokens(project.commits)} AI tokens consumed, averaging ~14.8K per commit.`);
  if (project.commits > 100) insightParts.push("One of the most actively developed projects on Narwhal.");
  if (project.downloads > 0) insightParts.push(`Downloaded by ${formatNumber(project.downloads)} developers.`);
  const insightText = insightParts.join(" ");

  const statusLabel = project.status === "published" ? "Published" : project.status === "stealth" ? "Stealth" : "Building";

  return (
    <div className="max-w-[680px]">
      {/* Top row */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm transition-colors duration-150"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        {isOwner && (
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors duration-150"
            style={{ border: "1px solid var(--border-ice)", color: "var(--text-secondary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
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
          height: 260,
          borderRadius: 16,
          backgroundImage: project.thumbnail_url && (!project.thumbnail_url.startsWith("data:") || project.thumbnail_url.length > 5000)
            ? `url("${project.thumbnail_url}")`
            : `url("${generateGradientSVG(project.name, 680, 260)}")`,
        }}
      />

      {/* Name + badge + visibility */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <h1 className="text-[28px] font-bold" style={{ color: "var(--text-primary)" }}>{project.name}</h1>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={
            project.status === "published"
              ? { background: "rgba(52,211,153,0.1)", color: "var(--accent-green)" }
              : { background: "var(--bg-surface)", color: "var(--text-secondary)" }
          }
        >
          {statusLabel}
        </span>
        {isOwner && (
          <button
            onClick={toggleVisibility}
            disabled={toggling}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150 disabled:opacity-50"
            style={{ border: "1px solid var(--border-ice)" }}
          >
            {project.status === "published" ? (
              <>
                <EyeOff size={14} style={{ color: "var(--text-secondary)" }} />
                <span style={{ color: "var(--text-secondary)" }}>Hide</span>
              </>
            ) : (
              <>
                <Eye size={14} style={{ color: "var(--accent-green)" }} />
                <span style={{ color: "var(--accent-green)" }}>Publish</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Builder info */}
      <button
        onClick={() => onUserClick(profile.username)}
        className="flex items-center gap-2.5 mb-5 transition-opacity duration-150 hover:opacity-80"
      >
        <Avatar name={displayName} size={24} />
        <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>@{profile.username}</span>
        {project.created_at && (
          <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>· Created {timeAgo(project.created_at)}</span>
        )}
      </button>

      {/* Description */}
      <p className="text-[15px] mb-6 max-w-[600px]" style={{ lineHeight: 1.7, color: "var(--text-secondary)" }}>
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
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-medium transition-opacity duration-150 hover:opacity-90"
              style={{ background: "var(--accent-green)", color: "#050a12" }}
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
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-medium transition-colors duration-150"
              style={{ border: "1px solid var(--border-ice)", color: "var(--text-secondary)" }}
            >
              Download
              <Download size={14} />
            </a>
          )}
        </div>
      )}

      {/* Stats grid */}
      {visibleStats.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {visibleStats.map((stat) => (
            <div key={stat.key} className="rounded-lg px-4 py-3 text-center" style={{ background: "var(--bg-surface)" }}>
              <div className="text-[18px] font-bold font-mono" style={{ color: stat.green ? "var(--accent-green)" : "var(--text-primary)" }}>
                {stat.display ? stat.display : (stat.value ? formatNumber(stat.value) : "\u2014")}
              </div>
              <div className="mt-0.5 text-[9px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tech stack */}
      {(project.tech_stack || []).length > 0 && (
        <div className="mb-6">
          <h3 className="text-[11px] font-medium uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Built with</h3>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="rounded-lg px-3 py-1.5 text-[12px] font-mono"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-ice)", color: "var(--text-secondary)" }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insightText && (
        <div className="mb-6 pl-4" style={{ borderLeft: "2px solid rgba(52, 211, 153, 0.1)" }}>
          <p className="text-[13px] italic" style={{ lineHeight: 1.7, color: "var(--text-secondary)" }}>{insightText}</p>
        </div>
      )}

      {/* Last active */}
      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
        {project.last_activity && <span>Last active {timeAgo(project.last_activity)}</span>}
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
