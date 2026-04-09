import Link from "next/link";
import NarwhalIcon from "@/components/NarwhalIcon";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-white" style={{ background: "#060a12" }}>
      <NarwhalIcon size={120} className="mb-6 text-muted/50" animate="float" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Lost at sea?</h1>
      <p className="text-sm text-muted mb-8">This page doesn&apos;t exist.</p>
      <Link
        href="/feed"
        className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-80"
      >
        Back to Feed
      </Link>
    </div>
  );
}
