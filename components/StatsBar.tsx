"use client";

import { formatNumber } from "@/lib/helpers";

interface StatCell {
  label: string;
  value: number | string | null | undefined;
  green?: boolean;
  mono?: boolean;
}

interface StatsBarProps {
  stats: StatCell[];
}

function renderValue(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "\u2014";
  if (typeof value === "string") {
    if (value === "undefined" || value === "NaN" || value === "undefinedd" || value === "NaNd") return "\u2014";
    return value;
  }
  if (isNaN(value)) return "\u2014";
  return formatNumber(value);
}

export default function StatsBar({ stats }: StatsBarProps) {
  return (
    <div
      className="grid rounded-xl"
      style={{
        gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="px-4 py-3.5 text-center">
          <div
            className={`text-lg font-semibold ${stat.mono ? "font-mono" : ""}`}
            style={{ color: stat.green ? "var(--accent-primary)" : "var(--text-primary)" }}
          >
            {renderValue(stat.value)}
          </div>
          <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
