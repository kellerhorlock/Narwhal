"use client";

import { useState } from "react";
import { timeAgo, getActionVerb } from "@/lib/helpers";
import type { Project, Profile } from "@/lib/types";

interface ActivityPulseProps {
  feedProjects: (Project & { profiles: Profile })[];
}

export default function ActivityPulse({ feedProjects }: ActivityPulseProps) {
  const [expanded, setExpanded] = useState(false);

  const activeBuilders = new Set(feedProjects.map((p) => p.user_id)).size;
  const isQuiet = activeBuilders === 0;

  const activities = feedProjects.slice(0, 20).map((p) => {
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
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-150 w-full ${
          isQuiet ? "cursor-default" : ""
        }`}
        style={{ color: isQuiet ? "var(--text-muted)" : "var(--text-secondary)" }}
        onMouseEnter={(e) => { if (!isQuiet) e.currentTarget.style.background = "var(--bg-hover)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
      >
        <span className="relative flex h-2 w-2">
          {!isQuiet && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--accent-primary)" }} />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: isQuiet ? "var(--text-muted)" : "var(--accent-primary)" }} />
        </span>
        <span className="text-xs">
          {isQuiet ? "All quiet for now" : `${activeBuilders} builder${activeBuilders !== 1 ? "s" : ""} active`}
        </span>
      </button>

      {expanded && activities.length > 0 && (
        <div className="mt-1 mx-2 rounded-lg overflow-hidden" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)" }}>
          <div className="max-h-[200px] overflow-y-auto">
            {activities.map((item, i) => (
              <div
                key={i}
                className="flex items-baseline gap-2 px-3 py-1.5 text-[11px]"
                style={{ borderBottom: i < activities.length - 1 ? "1px solid var(--border-default)" : undefined }}
              >
                <span className="font-mono flex-shrink-0 w-12 text-right" style={{ color: "var(--text-muted)" }}>{item.time}</span>
                <span className="truncate" style={{ color: "var(--text-secondary)" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
