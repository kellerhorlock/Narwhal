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

    router.push("/setup");
  }

  const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border-ice)", color: "var(--text-primary)" };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center" style={{ background: "var(--bg-deep)" }}>
      <NarwhalIcon size={60} style={{ color: "var(--text-primary)" }} className="mb-5" animate="fade-in" />
      <h1 className="mb-8 text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Join Narwhal</h1>
      <form onSubmit={handleSignup} className="flex w-full max-w-sm flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150"
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150"
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150"
          style={inputStyle}
        />
        {error && <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full py-3 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: "var(--accent-green)", color: "#050a12" }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-6 text-sm" style={{ color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link href="/login" className="hover:underline" style={{ color: "var(--text-primary)" }}>
          Log In
        </Link>
      </p>
    </div>
  );
}
