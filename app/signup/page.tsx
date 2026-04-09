"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import NarwhalIcon from "@/components/NarwhalIcon";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // New users have 0 projects — send them to setup
    router.push("/setup");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-white" style={{ background: "#060a12" }}>
      <NarwhalIcon size={60} className="mb-5 text-white" animate="fade-in" />
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Join Narwhal</h1>
      <form onSubmit={handleSignup} className="flex w-full max-w-sm flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors" style={{ background: "rgba(100, 160, 255, 0.03)", border: "1px solid var(--border-subtle)" }}
        />
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
          minLength={6}
          className="rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors" style={{ background: "rgba(100, 160, 255, 0.03)", border: "1px solid var(--border-subtle)" }}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-white py-3 text-sm font-semibold text-black transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-white hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
}
