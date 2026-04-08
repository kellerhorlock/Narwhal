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
    <div className="mb-6">
      {/* Header row */}
      <div className="mb-3 flex items-center gap-2.5">
        <Avatar name={displayName} size={28} />
        <span>
          <button
            onClick={() => onUserClick(profile.username)}
            className="font-semibold text-sm text-foreground hover:underline"
          >
            {displayName}
          </button>
          <span className="text-sm text-muted ml-1.5">{getActionVerb(project.name)}</span>
        </span>
        <span className="ml-auto text-xs text-muted">{timeAgo(project.last_activity)}</span>
      </div>

      {/* Project card */}
      <ProjectCard
        project={project}
        onClick={() => onProjectClick(project)}
      />
    </div>
  );
}
