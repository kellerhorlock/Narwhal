"use client";

import { generateGradientSVG, formatTokens, deriveStats } from "@/lib/helpers";
import type { Project } from "@/lib/types";
import { Eye, EyeOff } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  isStealth?: boolean;
  showMenuButton?: boolean;
  onMenuClick?: (e: React.MouseEvent) => void;
  height?: number;
}

export default function ProjectCard({ project, onClick, onContextMenu, isStealth, showMenuButton, onMenuClick, height = 220 }: ProjectCardProps) {
  const isUsableThumbnail = project.thumbnail_url && (
    !project.thumbnail_url.startsWith("data:") || project.thumbnail_url.length > 5000
  );
  const bgImage = isUsableThumbnail
    ? `url("${project.thumbnail_url}")`
    : `url("${generateGradientSVG(project.name, 860, height)}")`;

  const commitCount = project.commits || 0;
  const stats = deriveStats(commitCount);
  const statLine = commitCount > 0 ? `${formatTokens(commitCount)} tokens · ~${stats.hoursBuilding}h` : "Just started";

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="group relative w-full overflow-hidden cursor-pointer"
      style={{
        height,
        borderRadius: 16,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: bgImage, borderRadius: 16 }}
      />

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(5,10,18,0.85) 0%, transparent 60%)",
          borderRadius: 16,
        }}
      />

      {/* Stealth frosted overlay */}
      {isStealth && (
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "rgba(5,10,18,0.5)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
            borderRadius: 16,
          }}
        />
      )}

      {/* Three-dot menu button */}
      {showMenuButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(e);
          }}
          className="absolute top-3 right-3 z-30 rounded-full px-2 py-1 text-lg leading-none transition-colors duration-150"
          style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.7)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
        >
          &#x22EF;
        </button>
      )}

      {/* Bottom-left: name + stat */}
      <div className="absolute bottom-0 left-0 p-5 z-20 max-w-[75%]">
        <h3 className="text-[18px] font-bold leading-tight" style={{ color: "#ffffff" }}>{project.name}</h3>
        {!isStealth && (
          <div className="mt-1.5">
            <span className="text-[12px] font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{statLine}</span>
          </div>
        )}
      </div>

      {/* Bottom-right: visibility icon */}
      <div className="absolute bottom-5 right-5 z-20">
        {isStealth ? (
          <EyeOff size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
        ) : project.status === "published" ? (
          <Eye size={18} style={{ color: "var(--accent-green)" }} />
        ) : (
          <Eye size={18} style={{ color: "var(--accent-blue)" }} />
        )}
      </div>
    </div>
  );
}
