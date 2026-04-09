import Link from "next/link";
import NarwhalIcon from "@/components/NarwhalIcon";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center" style={{ background: "var(--bg-deep)" }}>
      <NarwhalIcon size={120} className="mb-6" style={{ color: "var(--text-primary)" }} animate="float" />
      <h1 className="mb-12 font-serif italic text-6xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Narwhal</h1>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="rounded-full px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--accent-green)", color: "#050a12" }}
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="rounded-full border px-8 py-3 text-sm font-medium transition-colors duration-150 hover:border-[rgba(56,200,255,0.1)]"
          style={{ borderColor: "var(--border-ice)", color: "var(--text-primary)" }}
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
