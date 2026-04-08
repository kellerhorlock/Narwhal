"use client";

export default function NarwhalIcon({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="40" y1="4" x2="40" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="37" y1="10" x2="43" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="37" y1="17" x2="43" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="40" cy="44" rx="22" ry="16" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M18 44 C10 44, 6 36, 12 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M12 32 C8 28, 4 32, 8 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M34 56 C32 64, 38 66, 40 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="50" cy="40" r="2" fill="currentColor" />
      <path d="M56 46 C58 48, 60 47, 61 45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
