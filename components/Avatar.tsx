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
      className="flex-shrink-0 flex items-center justify-center rounded-full font-semibold text-white select-none relative overflow-hidden"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: getAvatarGradient(name),
        boxShadow: showRing ? "0 0 0 2.5px #060a12, 0 0 0 4.5px #38ef7d" : undefined,
      }}
    >
      <NarwhalIcon size={size * 0.7} className="absolute text-white/[0.08]" />
      <span className="relative z-10">{initials}</span>
    </div>
  );
}
