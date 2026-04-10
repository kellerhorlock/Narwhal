"use client";

import { formatNumber, deriveStats, formatTokens } from "@/lib/helpers";

interface HumanMachineStatsProps {
  totalCommits: number;
  projectCount: number;
  launchedCount: number;
  followerCount: number;
  followingCount: number;
  createdAt: string;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
}

function renderVal(v: number | string | null): string {
  if (v === null || v === undefined) return "\u2014";
  if (typeof v === "string") return v;
  if (isNaN(v) || v === 0) return "\u2014";
  return formatNumber(v);
}

export default function HumanMachineStats({
  totalCommits,
  projectCount,
  launchedCount,
  followerCount,
  followingCount,
  onFollowersClick,
  onFollowingClick,
}: HumanMachineStatsProps) {
  const stats = deriveStats(totalCommits);
  const hoursDisplay = stats.hoursBuilding > 0 ? `~${stats.hoursBuilding}h` : null;

  return (
    <div className="flex flex-col gap-3">
      {/* THE HUMAN */}
      <div
        className="rounded-xl"
        style={{
          background: "var(--bg-surface)",
          borderLeft: "2px solid rgba(248, 180, 100, 0.15)",
          padding: "20px 24px",
        }}
      >
        <div className="mb-4">
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "rgba(248, 180, 100, 0.5)" }}>
            The Human
          </span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <Stat label="Hours Building" value={hoursDisplay} />
          <Stat label="Projects" value={projectCount} />
          <Stat label="Launched" value={launchedCount} />
          <Stat label="Followers" value={followerCount} onClick={onFollowersClick} />
          <Stat label="Following" value={followingCount} onClick={onFollowingClick} />
        </div>
      </div>

      {/* THE MACHINE */}
      <div
        className="rounded-xl"
        style={{
          background: "var(--bg-surface)",
          borderLeft: "2px solid rgba(56, 189, 248, 0.15)",
          padding: "20px 24px",
        }}
      >
        <div className="mb-4">
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "rgba(56, 189, 248, 0.5)" }}>
            The Machine
          </span>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <Stat label="Tokens" value={totalCommits > 0 ? formatTokens(totalCommits) : null} green mono />
          <Stat label="Total Commits" value={totalCommits} mono />
          <Stat label="Est. Lines" value={stats.linesOfCode} mono />
          <Stat label="Avg Tokens/Commit" value={totalCommits > 0 ? "750K" : null} mono />
          <Stat label="Projects" value={projectCount} mono />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, green, mono, onClick }: { label: string; value: number | string | null; green?: boolean; mono?: boolean; onClick?: () => void }) {
  const content = (
    <>
      <div
        className={`text-[20px] font-bold ${mono ? "font-mono" : ""}`}
        style={{ color: green ? "var(--accent-green)" : "var(--text-primary)" }}
      >
        {renderVal(value)}
      </div>
      <div className="text-[9px] font-medium uppercase tracking-wider mt-0.5" style={{ color: "var(--text-secondary)" }}>
        {label}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="text-left hover:opacity-80 transition-opacity cursor-pointer">
        {content}
      </button>
    );
  }

  return <div>{content}</div>;
}
