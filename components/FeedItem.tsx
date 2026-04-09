"use client";

import Avatar from "./Avatar";
import ProjectCard from "./ProjectCard";
import { getActionVerb, timeAgo } from "@/lib/helpers";
import type { Project, Profile } from "@/lib/types";

interface FeedItemProps {
  project: Project;
  profile: Profile;
  onProjectClick: (project: Project) => void;
  onUserClick: (username: string) => void;
}

export default function FeedItem({ project, profile, onProjectClick, onUserClick }: FeedItemProps) {
  const displayName = profile.display_name || profile.username;

  return (
    <div>
      {/* Header row */}
      <div className="mb-3 flex items-center gap-2.5">
        <Avatar name={displayName} size={28} />
        <span>
          <button
            onClick={() => onUserClick(profile.username)}
            className="font-semibold text-sm hover:underline"
            style={{ color: "var(--text-primary)" }}
          >
            {displayName}
          </button>
          <span className="text-sm ml-1.5" style={{ color: "var(--text-secondary)" }}>{getActionVerb(project.name)}</span>
        </span>
        <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>{timeAgo(project.last_activity)}</span>
      </div>

      <ProjectCard
        project={project}
        height={220}
        onClick={() => onProjectClick(project)}
      />
    </div>
  );
}
