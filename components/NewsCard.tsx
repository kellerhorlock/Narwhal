"use client";

import type { NewsEntry } from "@/lib/ai-news-feed";
import { ExternalLink } from "lucide-react";

const categoryStyles: Record<string, { pill: string; border: string }> = {
  "Model Release": { pill: "bg-cyan-500/15 text-cyan-400", border: "rgba(0,200,220,0.4)" },
  "Vibe Coding": { pill: "bg-accent/15 text-accent", border: "rgba(56,239,125,0.4)" },
  "Industry": { pill: "bg-orange-500/15 text-orange-400", border: "rgba(255,160,50,0.4)" },
  "Culture": { pill: "bg-pink-500/15 text-pink-400", border: "rgba(255,100,150,0.4)" },
  "Research": { pill: "bg-blue-500/15 text-blue-400", border: "rgba(100,160,255,0.4)" },
  "Frontier": { pill: "bg-red-500/15 text-red-400", border: "rgba(255,60,60,0.5)" },
};

export default function NewsCard({ entry }: { entry: NewsEntry }) {
  const style = categoryStyles[entry.category] || categoryStyles["Research"];

  return (
    <a
      href={entry.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 w-full rounded-xl px-4 py-3 transition-colors duration-150 hover:bg-white/[0.03]"
      style={{
        background: "rgba(100,160,255,0.02)",
        borderLeft: `3px solid ${style.border}`,
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${style.pill}`}>
            {entry.category}
          </span>
          <span className="text-[11px] text-white/25">{entry.source} · {entry.timestamp}</span>
        </div>
        <h3 className="text-[14px] font-medium text-foreground/70 leading-snug line-clamp-2 group-hover:text-foreground/90 transition-colors">
          {entry.title}
        </h3>
      </div>
      <ExternalLink size={12} className="flex-shrink-0 mt-2 text-white/15 group-hover:text-white/40 transition-colors" />
    </a>
  );
}
