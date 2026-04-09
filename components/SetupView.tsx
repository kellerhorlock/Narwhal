"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Copy, Check, ChevronDown, ChevronUp, RefreshCw, Key } from "lucide-react";
import NarwhalIcon from "./NarwhalIcon";

interface SetupViewProps {
  userId: string;
}

export default function SetupView({ userId }: SetupViewProps) {
  const [apiKey, setApiKey] = useState("");
  const [keyLoading, setKeyLoading] = useState(true);
  const [keyError, setKeyError] = useState("");
  const [copied, setCopied] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [showExplainerTop, setShowExplainerTop] = useState(false);
  const [showExplainerBottom, setShowExplainerBottom] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  // Manual form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [status, setStatus] = useState<"active" | "published" | "stealth">("active");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function fetchApiKey() {
    setKeyLoading(true);
    setKeyError("");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("narwhal_api_key")
      .eq("id", userId)
      .single();

    if (error || !data?.narwhal_api_key) {
      setKeyError("Could not load API key. Please try again.");
      setKeyLoading(false);
      return;
    }
    setApiKey(data.narwhal_api_key);
    setKeyLoading(false);
  }

  async function regenerateKey() {
    setRegenerating(true);
    const supabase = createClient();
    const newKey = crypto.randomUUID();
    const { error } = await supabase
      .from("profiles")
      .update({ narwhal_api_key: newKey })
      .eq("id", userId);

    if (!error) {
      setApiKey(newKey);
    }
    setRegenerating(false);
  }

  useEffect(() => {
    fetchApiKey();
  }, []);

  const syncUrl = "https://narwhal.codes/api/sync";

  const prompt = `Connect my coding projects to Narwhal (narwhal.codes). Be thorough — I want RICH profiles.

STEP 1 — SCAN FOR PROJECTS:
Search: ~/Desktop, ~/Documents, ~/Projects, ~/repos, ~/code, ~/dev
A project = any dir with package.json, Cargo.toml, pyproject.toml, go.mod, Gemfile, requirements.txt, pubspec.yaml, composer.json, or .git.
Skip: node_modules, .next, __pycache__, venv, dist, build, hidden dirs, and any project named 'vibefeed' or 'narwhal'.
Max depth: 3 levels.

STEP 2 — FOR EACH PROJECT:

A) BASIC INFO:
   - name: From package.json name field, or directory name
   - commits: \`git log --oneline 2>/dev/null | wc -l | tr -d ' '\`
   - tech_stack: Detect from deps and file extensions. Be specific — "Next.js" not "JavaScript", "Supabase" if @supabase in deps.

B) DESCRIPTION (CRITICAL):
   Read README.md (first 100 lines), package.json description, and main source files.
   Write 1-2 sentences (under 200 chars) like a YC pitch — what it does and why anyone should care.
   BAD: "A Next.js application with Supabase backend"
   GOOD: "Smart scheduling for medical practices. Reduces no-shows by 40% with AI-powered reminders."

C) FIND URLs:
   Check: package.json homepage, CNAME, vercel.json, netlify.toml, git remote.
   Store live site as landing_url, repo as download_url.

D) FIND THUMBNAIL:
   Check README images, /public/og-image.png, /public/screenshot.png, any .png in /public/ or /assets/.
   Convert local images to base64 data URLs. If nothing found, leave null.

STEP 3 — PRESENT FOR APPROVAL:
📦 [name]
   [description]
   Stack: [tech_stack]
   [commits] commits
   🌐 [landing_url or "none"] · 📂 [download_url or "none"] · 🖼️ [found/not found]
   Upload? (y/n)

STEP 4 — UPLOAD:
curl -s --max-time 30 -X POST '${syncUrl}' \\
  -H 'x-narwhal-key: ${apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "[NAME]",
    "description": "[DESCRIPTION]",
    "tech_stack": [TECH_ARRAY],
    "status": "stealth",
    "commits": [COMMITS],
    "landing_url": [URL_OR_NULL],
    "download_url": [URL_OR_NULL],
    "thumbnail_url": [URL_OR_NULL]
  }'

Escape all strings. Use null (not "null") for missing URLs. Retry once on failure.

STEP 5 — INSTALL GIT HOOKS:
For each project with .git, create post-commit and post-checkout hooks:

#!/bin/sh
COMMITS=$(git log --oneline | wc -l | tr -d ' ')
curl -s --max-time 10 -X PATCH '${syncUrl}' \\
  -H 'x-narwhal-key: ${apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d "{\\"name\\": \\"[PROJECT_NAME]\\", \\"commits\\": $COMMITS, \\"last_activity\\": \\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\\"}" 2>/dev/null &

chmod +x both hooks.

STEP 6 — DONE:
✅ [X] projects uploaded · 🔄 Hooks on [Y] projects · 📸 [Z] thumbnails
Profile live at narwhal.codes. Every commit auto-syncs. All stats derived from commit count.`;

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  }

  async function handleCopyKey() {
    await navigator.clipboard.writeText(apiKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 3000);
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setSubmitting(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("projects").insert({
      user_id: userId,
      name,
      description: description || null,
      tech_stack: techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      status,
    });

    if (insertError) {
      setFormError(insertError.message);
    } else {
      setFormSuccess(`"${name}" created!`);
      setName("");
      setDescription("");
      setTechStack("");
      setStatus("active");
    }
    setSubmitting(false);
  }

  return (
    <div>
      <div className="mb-6" style={{ filter: "drop-shadow(0 0 20px rgba(52, 211, 153, 0.15))" }}>
        <NarwhalIcon size={80} style={{ color: "var(--text-primary)" }} animate="fade-in" />
      </div>
      <h1 className="font-serif italic text-3xl mb-2" style={{ color: "var(--text-primary)" }}>
        You&apos;re in. Let&apos;s load your work.
      </h1>
      <p className="text-sm mb-10 max-w-xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        Copy this prompt and paste it into Claude Code, Cursor, or any AI coding tool.
        It will find all your projects and sync them to Narwhal automatically.
      </p>

      {/* Content block */}
      {keyLoading ? (
        <div className="rounded-xl py-20 text-center" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-ice)", color: "var(--text-secondary)" }}>
          Loading credentials...
        </div>
      ) : keyError ? (
        <div className="rounded-xl p-6 text-center" style={{ background: "var(--bg-surface)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          <p className="text-sm mb-3" style={{ color: "#f87171" }}>{keyError}</p>
          <button
            onClick={fetchApiKey}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150"
            style={{ border: "1px solid var(--border-ice)", color: "var(--text-primary)" }}
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Top copy button */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 mb-4"
            style={copied
              ? { background: "rgba(52, 211, 153, 0.1)", border: "1px solid rgba(52, 211, 153, 0.2)", color: "var(--accent-green)" }
              : { background: "var(--accent-green)", color: "#050a12" }
            }
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied! Now paste it into your coding agent" : "Copy to Clipboard"}
          </button>

          {/* Top accordion */}
          <div className="mb-5">
            <button
              onClick={() => setShowExplainerTop(!showExplainerTop)}
              className="flex items-center gap-2 text-sm font-medium transition-colors duration-150"
              style={{ color: "var(--text-secondary)" }}
            >
              {showExplainerTop ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              What this does
            </button>
            {showExplainerTop && (
              <div className="mt-3 rounded-xl p-4 text-sm leading-relaxed max-w-xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-ice)" }}>
                <p className="mb-2" style={{ color: "var(--text-secondary)" }}>When you paste this prompt into your AI coding agent, it will:</p>
                <ol className="list-decimal list-inside space-y-1.5" style={{ color: "var(--text-muted)" }}>
                  <li>Scan your machine for all coding project directories</li>
                  <li>Gather rich data: description, tech stack, thumbnails, URLs, commits</li>
                  <li>Show you each project and ask for your approval before uploading</li>
                  <li>Upload approved projects with full metadata to your Narwhal profile</li>
                  <li>Install git hooks so future commits auto-sync stats</li>
                </ol>
              </div>
            )}
          </div>

          {/* Prompt block */}
          <div className="rounded-xl overflow-hidden mb-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-ice)" }}>
            <pre className="p-5 text-[13px] font-mono leading-relaxed overflow-x-auto" style={{ color: "var(--text-secondary)" }}>
              {prompt}
            </pre>
          </div>

          {/* Bottom copy button */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200"
            style={copied
              ? { background: "rgba(52, 211, 153, 0.1)", border: "1px solid rgba(52, 211, 153, 0.2)", color: "var(--accent-green)" }
              : { background: "var(--accent-green)", color: "#050a12" }
            }
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied! Now paste it into your coding agent" : "Copy to Clipboard"}
          </button>

          {/* Bottom accordion */}
          <div className="mt-5 mb-6">
            <button
              onClick={() => setShowExplainerBottom(!showExplainerBottom)}
              className="flex items-center gap-2 text-sm font-medium transition-colors duration-150"
              style={{ color: "var(--text-secondary)" }}
            >
              {showExplainerBottom ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              What this does
            </button>
            {showExplainerBottom && (
              <div className="mt-3 rounded-xl p-4 text-sm leading-relaxed max-w-xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-ice)" }}>
                <p className="mb-2" style={{ color: "var(--text-secondary)" }}>When you paste this prompt into your AI coding agent, it will:</p>
                <ol className="list-decimal list-inside space-y-1.5" style={{ color: "var(--text-muted)" }}>
                  <li>Scan your machine for all coding project directories</li>
                  <li>Gather rich data: description, tech stack, thumbnails, URLs, commits</li>
                  <li>Show you each project and ask for your approval before uploading</li>
                  <li>Upload approved projects with full metadata to your Narwhal profile</li>
                  <li>Install git hooks so future commits auto-sync stats</li>
                </ol>
              </div>
            )}
          </div>

          {/* API Key display */}
          <div className="rounded-xl p-4 mb-10" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-ice)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Key size={14} style={{ color: "var(--accent-green)" }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Your API Key</span>
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-sm font-mono break-all" style={{ color: "var(--text-secondary)" }}>{apiKey}</code>
              <button
                onClick={handleCopyKey}
                className="flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150"
                style={{ border: "1px solid var(--border-ice)", color: "var(--text-secondary)" }}
              >
                {keyCopied ? <Check size={12} className="inline" /> : <Copy size={12} className="inline" />}
                {keyCopied ? " Copied" : " Copy"}
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>This key never expires. Keep it private.</span>
              <button
                onClick={regenerateKey}
                disabled={regenerating}
                className="inline-flex items-center gap-1.5 text-[11px] transition-colors duration-150 disabled:opacity-50"
                style={{ color: "var(--text-secondary)" }}
              >
                <RefreshCw size={11} className={regenerating ? "animate-spin" : ""} />
                {regenerating ? "Regenerating..." : "Regenerate Key"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Divider */}
      <div className="mb-10" style={{ borderTop: "1px solid var(--border-ice)" }} />

      {/* Manual form */}
      <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Or add a project manually</h2>
      <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>Create a project directly from here.</p>

      <form onSubmit={handleCreateProject} className="max-w-lg flex flex-col gap-4">
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-ice)", color: "var(--text-primary)" }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150 resize-none"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-ice)", color: "var(--text-primary)" }}
        />
        <input
          type="text"
          placeholder="Tech stack (comma separated, e.g. React, TypeScript, Supabase)"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          className="rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-ice)", color: "var(--text-primary)" }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "active" | "published" | "stealth")}
          className="rounded-xl px-4 py-3 text-sm outline-none transition-colors duration-150"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-ice)", color: "var(--text-primary)" }}
        >
          <option value="active">Active</option>
          <option value="published">Published</option>
          <option value="stealth">Stealth</option>
        </select>

        {formError && <p className="text-sm" style={{ color: "#f87171" }}>{formError}</p>}
        {formSuccess && <p className="text-sm" style={{ color: "var(--accent-green)" }}>{formSuccess}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full py-3 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: "var(--accent-green)", color: "#050a12" }}
        >
          {submitting ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
