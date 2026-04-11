"use client";

interface BuilderScoreBadgeProps {
  score: number;
  percentile?: number;
  size?: "sm" | "lg";
}

export default function BuilderScoreBadge({ score, percentile, size = "sm" }: BuilderScoreBadgeProps) {
  if (!score || isNaN(score) || score <= 0) return null;

  if (size === "lg") {
    return (
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{ background: "var(--accent-primary-light)", border: "1px solid rgba(255,0,131,0.15)" }}
        >
          <span className="text-sm font-semibold font-mono" style={{ color: "var(--accent-primary)" }}>{score}</span>
          <span className="text-[10px] font-medium uppercase" style={{ color: "rgba(255,0,131,0.6)" }}>Score</span>
        </span>
        {percentile !== undefined && percentile > 0 && (
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Top {percentile}%</span>
        )}
      </div>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
      style={{ background: "var(--accent-primary-light)", border: "1px solid rgba(255,0,131,0.15)" }}
    >
      <span className="text-[12px] font-semibold font-mono" style={{ color: "var(--accent-primary)" }}>{score}</span>
    </span>
  );
}
