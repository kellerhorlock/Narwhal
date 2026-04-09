"use client";

import { generateGradientSVG, formatTokens, deriveStats } from "@/lib/helpers";
import type { Project } from "@/lib/types";
import { Eye, EyeOff, Hammer } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  isStealth?: boolean;
  showMenuButton?: boolean;
  onMenuClick?: (e: React.MouseEvent) => void;
}

export default function ProjectCard({ project, onClick, onContextMenu, isStealth, showMenuButton, onMenuClick }: ProjectCardProps) {
  const bgImage = project.thumbnail_url
    ? `url("${project.thumbnail_url}")`
    : `url("${generateGradientSVG(project.name, 860, 220)}")`;

  const description = project.description || "No description yet";
  const commitCount = project.commits || 0;
  const stats = deriveStats(commitCount);
  const statLine = commitCount > 0 ? `${formatTokens(commitCount)} tokens · ~${stats.hoursBuilding}h` : "Just started";

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
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 40%, transparent 65%)",
          borderRadius: 20,
        }}
      />

      {/* Stealth frosted overlay */}
      {isStealth && (
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "rgba(6,10,18,0.4)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            borderRadius: 20,
          }}
        />
      )}

      {/* Three-dot menu button (top-right, for own profile cards) */}
      {showMenuButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(e);
          }}
          className="absolute top-3 right-3 z-30 rounded-full bg-black/40 backdrop-blur-sm px-2 py-1 text-white/70 hover:text-white hover:bg-black/60 transition-colors text-lg leading-none"
        >
          &#x22EF;
        </button>
      )}

      {/* Bottom-left: name + description + stat */}
      <div className="absolute bottom-0 left-0 p-5 z-20 max-w-[75%]">
        <h3 className="text-[20px] font-bold text-white leading-tight">{project.name}</h3>
        <p className="text-[13px] text-white/60 mt-1 line-clamp-2 leading-snug">
          {description}
        </p>
        {!isStealth && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[13px] font-mono text-white/50">{statLine}</span>
          </div>
        )}
      </div>

      {/* Bottom-right: visibility icon */}
      <div className="absolute bottom-5 right-5 z-20">
        {isStealth ? (
          <EyeOff size={20} className="text-white/50" />
        ) : project.status === "published" ? (
          <Eye size={20} style={{ color: "#38ef7d" }} />
        ) : (
          <Hammer size={20} style={{ color: "#60a5fa" }} />
        )}
      </div>
    </div>
  );
}
