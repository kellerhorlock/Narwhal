import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-white" style={{ background: "#060a12" }}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-6"
      >
        {/* Horn */}
        <line x1="40" y1="4" x2="40" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="37" y1="10" x2="43" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="37" y1="17" x2="43" y2="21" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        {/* Body */}
        <ellipse cx="40" cy="44" rx="22" ry="16" stroke="white" strokeWidth="2" fill="none" />
        {/* Tail */}
        <path d="M18 44 C10 44, 6 36, 12 32" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M12 32 C8 28, 4 32, 8 36" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Flipper */}
        <path d="M34 56 C32 64, 38 66, 40 60" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Eye */}
        <circle cx="50" cy="40" r="2" fill="white" />
        {/* Mouth */}
        <path d="M56 46 C58 48, 60 47, 61 45" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>
      <h1 className="mb-12 text-6xl font-bold tracking-tight">Narwhal</h1>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-80"
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="rounded-full border px-8 py-3 text-sm font-semibold text-white transition-colors hover:border-white/20"
          style={{ borderColor: "var(--border-medium)" }}
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
