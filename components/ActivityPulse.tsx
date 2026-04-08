"use client";

import { useState } from "react";
import { timeAgo, getActionVerb } from "@/lib/helpers";
import type { Project, Profile } from "@/lib/types";

interface ActivityItem {
  text: string;
  time: string;
}

interface ActivityPulseProps {
  feedProjects: (Project & { profiles: Profile })[];
}

export default function ActivityPulse({ feedProjects }: ActivityPulseProps) {
  const [expanded, setExpanded] = useState(false);

  const activeBuilders = new Set(feedProjects.map((p) => p.user_id)).size;
  const isQuiet = activeBuilders === 0;

  const activities: ActivityItem[] = feedProjects.slice(0, 20).map((p) => {
    const name = p.profiles?.display_name || p.profiles?.username || "Someone";
    const verb = getActionVerb(p.name);
    return {
      text: `${name} ${verb} ${p.name}`,
      time: timeAgo(p.last_activity),
    };
  });

  return (
    <div className="mt-4 mb-2">
      <button
        onClick={() => !isQuiet && setExpanded(!expanded)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted transition-colors duration-150 w-full ${
          isQuiet ? "cursor-default" : "hover:bg-white/[0.03]"
        }`}
      >
        <span className="relative flex h-2 w-2">
          {!isQuiet && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${isQuiet ? "bg-zinc-600" : "bg-accent"}`} />
        </span>
        <span className="text-xs">
          {isQuiet ? "All quiet for now" : `${activeBuilders} builder${activeBuilders !== 1 ? "s" : ""} active`}
        </span>
      </button>

      {expanded && activities.length > 0 && (
        <div className="mt-1 mx-2 rounded-lg border border-border bg-card overflow-hidden">
          <div className="max-h-[200px] overflow-y-auto">
            {activities.map((item, i) => (
              <div
                key={i}
                className="flex items-baseline gap-2 px-3 py-1.5 text-[11px] border-b border-border last:border-b-0"
              >
                <span className="font-mono text-muted flex-shrink-0 w-12 text-right">{item.time}</span>
                <span className="text-foreground/60 truncate">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
