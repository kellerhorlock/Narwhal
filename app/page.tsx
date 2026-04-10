import Link from "next/link";
import NarwhalIcon from "@/components/NarwhalIcon";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <NarwhalIcon size={120} className="mb-6" style={{ color: "var(--text-primary)" }} animate="float" />
      <h1 className="mb-12 font-serif italic text-6xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Narwhal</h1>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="rounded-full px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ background: "var(--accent-primary)", color: "var(--text-inverse)", boxShadow: "var(--shadow-md)" }}
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="rounded-full border px-8 py-3 text-sm font-medium transition-colors duration-150"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-primary)" }}
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
