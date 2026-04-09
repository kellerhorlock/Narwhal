import Link from "next/link";
import NarwhalIcon from "@/components/NarwhalIcon";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-white" style={{ background: "#060a12" }}>
      <NarwhalIcon size={120} className="mb-6 text-white" animate="float" />
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
