"use client";

interface BuilderScoreBadgeProps {
  score: number;
  percentile?: number;
  size?: "sm" | "lg";
}

export default function BuilderScoreBadge({ score, percentile, size = "sm" }: BuilderScoreBadgeProps) {
  // Never render if score is falsy, 0, or NaN
  if (!score || isNaN(score) || score <= 0) return null;

  if (size === "lg") {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 border border-accent/20 px-3 py-1">
          <span className="text-sm font-bold font-mono text-accent">{score}</span>
          <span className="text-[10px] font-medium text-accent/70 uppercase">Score</span>
        </span>
        {percentile !== undefined && percentile > 0 && (
          <span className="text-xs text-muted">Top {percentile}%</span>
        )}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5">
      <span className="text-[11px] font-bold font-mono text-accent">{score}</span>
    </span>
  );
}
