import Link from "next/link";
import NarwhalIcon from "@/components/NarwhalIcon";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <NarwhalIcon size={120} style={{ color: "var(--text-primary)" }} animate="float" className="mb-6" />
      <h1 className="text-3xl font-semibold tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>Lost at sea?</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>This page doesn&apos;t exist.</p>
      <Link
        href="/feed"
        className="rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
        style={{ background: "var(--accent-primary)", color: "var(--text-inverse)" }}
      >
        Back to Feed
      </Link>
    </div>
  );
}
