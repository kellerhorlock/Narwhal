"use client";

import { getAvatarGradient } from "@/lib/helpers";

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
        color: "#ffffff",
        background: getAvatarGradient(name),
        border: "2px solid #ffffff",
        boxShadow: showRing ? "0 0 20px rgba(14,116,144,0.15)" : "var(--shadow-sm)",
      }}
    >
      <span className="relative z-10">{initials}</span>
    </div>
  );
}
