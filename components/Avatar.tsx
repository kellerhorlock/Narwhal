"use client";

import { getAvatarGradient } from "@/lib/helpers";
import NarwhalIcon from "./NarwhalIcon";

interface AvatarProps {
  name: string;
  size?: number;
  showRing?: boolean;
}

export default function Avatar({ name, size = 40, showRing = false }: AvatarProps) {
  const initials = (name || "?")
    .split(/[\s_-]+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-full font-semibold select-none relative overflow-hidden"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        color: "var(--text-primary)",
        background: getAvatarGradient(name),
        border: "1px solid var(--border-ice)",
        boxShadow: showRing ? "0 0 20px rgba(52, 211, 153, 0.1)" : undefined,
      }}
    >
      <NarwhalIcon size={size * 0.7} className="absolute" style={{ color: "rgba(255,255,255,0.06)" }} />
      <span className="relative z-10">{initials}</span>
    </div>
  );
}
