"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/feed");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-white" style={{ background: "#060a12" }}>
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Log in to Narwhal</h1>
      <form onSubmit={handleLogin} className="flex w-full max-w-sm flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors" style={{ background: "rgba(100, 160, 255, 0.03)", border: "1px solid var(--border-subtle)" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors" style={{ background: "rgba(100, 160, 255, 0.03)", border: "1px solid var(--border-subtle)" }}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-white py-3 text-sm font-semibold text-black transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-white hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
