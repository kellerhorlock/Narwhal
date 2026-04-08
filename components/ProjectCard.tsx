"use client";

import { generateGradientSVG, formatNumber } from "@/lib/helpers";
import type { Project } from "@/lib/types";
import { Lock, ArrowDown, GitCommit, Zap } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  isStealth?: boolean;
}

export default function ProjectCard({ project, onClick, onContextMenu, isStealth }: ProjectCardProps) {
  const bgImage = project.thumbnail_url
    ? `url("${project.thumbnail_url}")`
    : `url("${generateGradientSVG(project.name, 860, 220)}")`;

  // Pick the most impressive stat
  let statText = "";
  let StatIcon = Zap;
  if (project.downloads > 0) {
    statText = `${formatNumber(project.downloads)} downloads`;
    StatIcon = ArrowDown;
  } else if (project.commit_count > 0) {
    statText = `${formatNumber(project.commit_count)} commits`;
    StatIcon = GitCommit;
  } else if (project.tokens_used > 0) {
    statText = `${formatNumber(project.tokens_used)} tokens`;
    StatIcon = Zap;
  }

  const isLaunched = project.status === "published";
  const isBuilding = project.status === "active";

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="group relative w-full overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
      style={{
        height: 220,
        borderRadius: 20,
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: bgImage, borderRadius: 20 }}
      />

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
          borderRadius: 20,
        }}
      />

      {/* Stealth frosted overlay */}
      {isStealth && (
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            borderRadius: 20,
          }}
        >
          <div className="absolute top-4 right-4">
            <Lock size={16} className="text-white/60" />
          </div>
        </div>
      )}

      {/* Bottom-left: name + stat */}
      <div className="absolute bottom-0 left-0 p-5 z-20">
        <h3 className="text-[20px] font-bold text-white leading-tight">{project.name}</h3>
        {statText && !isStealth && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <StatIcon size={13} className="text-white/50" />
            <span className="text-[13px] font-mono text-white/50">{statText}</span>
          </div>
        )}
      </div>

      {/* Bottom-right: status pill */}
      {!isStealth && (
        <div className="absolute bottom-5 right-5 z-20">
          {isLaunched && (
            <span className="rounded-full bg-accent/20 px-2.5 py-1 text-[11px] font-semibold text-accent backdrop-blur-sm">
              Launched
            </span>
          )}
          {isBuilding && (
            <span className="rounded-full bg-blue-500/20 px-2.5 py-1 text-[11px] font-semibold text-blue-400 backdrop-blur-sm">
              Building
            </span>
          )}
        </div>
      )}
    </div>
  );
}
