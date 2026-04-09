"use client";

import type { NewsEntry } from "@/lib/ai-news-feed";
import { ExternalLink } from "lucide-react";

const categoryBorders: Record<string, string> = {
  "Model Release": "rgba(56, 189, 248, 0.4)",
  "Vibe Coding": "rgba(52, 211, 153, 0.4)",
  "Industry": "rgba(245, 158, 11, 0.4)",
  "Culture": "rgba(244, 114, 182, 0.4)",
  "Research": "rgba(56, 189, 248, 0.3)",
  "Frontier": "rgba(239, 68, 68, 0.4)",
};

const categoryPills: Record<string, { bg: string; color: string }> = {
  "Model Release": { bg: "rgba(56, 189, 248, 0.1)", color: "var(--accent-blue)" },
  "Vibe Coding": { bg: "rgba(52, 211, 153, 0.1)", color: "var(--accent-green)" },
  "Industry": { bg: "rgba(245, 158, 11, 0.1)", color: "var(--accent-warm)" },
  "Culture": { bg: "rgba(244, 114, 182, 0.1)", color: "#f472b6" },
  "Research": { bg: "rgba(56, 189, 248, 0.08)", color: "var(--accent-blue)" },
  "Frontier": { bg: "rgba(239, 68, 68, 0.1)", color: "#f87171" },
};

export default function NewsCard({ entry }: { entry: NewsEntry }) {
  const border = categoryBorders[entry.category] || categoryBorders["Research"];
  const pill = categoryPills[entry.category] || categoryPills["Research"];

  return (
    <a
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 w-full rounded-xl px-4 py-3 transition-colors duration-150"
      style={{
        background: "var(--bg-surface)",
        borderLeft: `3px solid ${border}`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: pill.bg, color: pill.color }}
          >
            {entry.category}
          </span>
          <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{entry.source} · {entry.timestamp}</span>
        </div>
        <h3
          className="text-[14px] font-medium leading-snug line-clamp-2 transition-colors duration-150"
          style={{ color: "var(--text-secondary)" }}
        >
          {entry.title}
        </h3>
      </div>
      <ExternalLink size={12} className="flex-shrink-0 mt-2" style={{ color: "var(--text-muted)" }} />
    </a>
  );
}
