"use client";

import type { NewsEntry } from "@/lib/ai-news-feed";
import { ExternalLink } from "lucide-react";

const categoryBorders: Record<string, string> = {
  "Frontier": "#FF0083",
  "Model Release": "#FF0083",
  "Vibe Coding": "#059669",
  "Industry": "#ea580c",
  "Culture": "#9333ea",
  "Research": "#1e40af",
};

const categoryPills: Record<string, { bg: string; color: string }> = {
  "Frontier": { bg: "var(--accent-primary-light)", color: "var(--accent-primary)" },
  "Model Release": { bg: "var(--accent-primary-light)", color: "var(--accent-primary)" },
  "Vibe Coding": { bg: "rgba(5,150,105,0.08)", color: "#059669" },
  "Industry": { bg: "rgba(234,88,12,0.08)", color: "#ea580c" },
  "Culture": { bg: "rgba(147,51,234,0.08)", color: "#9333ea" },
  "Research": { bg: "rgba(30,64,175,0.08)", color: "#1e40af" },
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
        border: "1px solid var(--border-default)",
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
          style={{ color: "var(--text-primary)" }}
        >
          {entry.title}
        </h3>
      </div>
      <ExternalLink size={12} className="flex-shrink-0 mt-2" style={{ color: "var(--text-muted)" }} />
    </a>
  );
}
