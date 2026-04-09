"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Copy, Check, ChevronDown, ChevronUp, RefreshCw, Key } from "lucide-react";

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

  const syncUrl = "https://narwhal-five.vercel.app/api/sync";

  const prompt = `I need you to connect my coding projects to my Narwhal profile (narwhal.dev — a social platform for builders).

STEP 1 — SCAN FOR PROJECTS:
Search these directories for coding projects: ~/Desktop, ~/Documents, ~/Projects, ~/repos, ~/code, ~/dev, and ~/.
A "project" is any directory containing: package.json, Cargo.toml, pyproject.toml, go.mod, Gemfile, requirements.txt, pubspec.yaml, composer.json, or a .git directory.
Skip node_modules, .next, __pycache__, venv, dist, build, and hidden directories.
Skip any project named 'vibefeed' or 'narwhal' — that's this platform itself.
Do NOT recurse deeper than 3 levels.

STEP 2 — FOR EACH PROJECT FOUND:
Read the README.md (if it exists), the main config file (package.json, etc), and scan the file structure.
Generate:
  - name: From config file or directory name
  - description: Generate a compelling 1-2 sentence description (under 200 chars) that would make another developer want to check it out. Write it like a YC startup pitch — what does it do and why should anyone care? Don't be generic. Don't just list technologies. Focus on what makes it interesting or useful. THIS FIELD IS REQUIRED — always generate a description.
  - tech_stack: Array of technologies detected from dependencies and file extensions (e.g. ["Next.js", "Supabase", "TypeScript"])
  - commits: Run \`git log --oneline 2>/dev/null | wc -l\` (0 if not a git repo)
  - lines: Estimate total lines of source code (skip generated files, node_modules, etc)
  - Also check if the project has a README.md with a screenshot or hero image URL. If so, include it as thumbnail_url.
  - Check if the project has a live URL in package.json homepage field, or in a CNAME file, or in a vercel.json/netlify.toml. If found, include it as landing_url.
  - Check if the project has a GitHub repo URL in package.json repository field. If found, include it as download_url.
  - Estimate tokens consumed by calculating: (lines_of_code * 3) + (commits * 500). This is a rough approximation of AI-assisted development tokens.

Present each project to me like this:
📦 [name]
   [description]
   Stack: [tech_stack]
   [commits] commits · [lines] lines · ~[estimated_tokens] tokens
   URLs: [landing_url or "none"] | [download_url or "none"]
   Upload? (y/n)

STEP 3 — UPLOAD APPROVED PROJECTS:
For each project I approve, run this curl command. Make sure to properly escape the description string in the JSON:

curl -X POST '${syncUrl}' \\
  -H 'x-narwhal-key: ${apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "[NAME]",
    "description": "[DESCRIPTION]",
    "tech_stack": [TECH_ARRAY],
    "status": "stealth",
    "tokens_used": [ESTIMATED_TOKENS],
    "commits": [COMMITS_COUNT],
    "lines_changed": [LINES_COUNT],
    "landing_url": "[URL_OR_NULL]",
    "download_url": "[REPO_URL_OR_NULL]",
    "last_activity": "now()"
  }'

IMPORTANT: The description field MUST be included and properly JSON-escaped. Do not send null for description — always generate one.

STEP 4 — INSTALL AUTO-SYNC:
For each uploaded project that has a .git directory, create a post-commit hook:

Create the file .git/hooks/post-commit with this content:
#!/bin/sh
COMMITS=$(git log --oneline | wc -l | tr -d ' ')
curl -s -X PATCH '${syncUrl}' \\
  -H 'x-narwhal-key: ${apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d "{\\"name\\": \\"[PROJECT_NAME]\\", \\"last_activity\\": \\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\\", \\"commits\\": $COMMITS}" 2>/dev/null &

Then run: chmod +x .git/hooks/post-commit

Also create a NEW hook: .git/hooks/post-checkout with the same content as post-commit. This way when the user starts working on a project (checks out a branch), it also pings Narwhal.
Then run: chmod +x .git/hooks/post-checkout

STEP 5 — SUMMARY:
After all uploads and hook installations, print:
✅ Done! [X] projects uploaded to Narwhal.
🔄 Auto-sync installed on [Y] projects.
Your profile is live — visit narwhal.dev/profile to see it.
From now on, every time you commit or switch branches in any of these projects, Narwhal will automatically update. No action needed.`;

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
      <h1 className="font-serif italic text-3xl text-foreground mb-2">
        You&apos;re in. Let&apos;s load your work.
      </h1>
      <p className="text-sm text-muted mb-10 max-w-xl leading-relaxed">
        Copy this prompt and paste it into Claude Code, Cursor, or any AI coding tool.
        It will find all your projects and sync them to Narwhal automatically.
      </p>

      {/* Content block */}
      {keyLoading ? (
        <div className="rounded-xl border border-border bg-card py-20 text-center text-muted">
          Loading credentials...
        </div>
      ) : keyError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-400 mb-3">{keyError}</p>
          <button
            onClick={fetchApiKey}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
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
            className={`w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 mb-4 ${
              copied
                ? "bg-accent/15 border border-accent/30 text-accent"
                : "bg-accent text-black hover:opacity-90"
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied! Now paste it into your coding agent" : "Copy to Clipboard"}
          </button>

          {/* Top accordion */}
          <div className="mb-5">
            <button
              onClick={() => setShowExplainerTop(!showExplainerTop)}
              className="flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              {showExplainerTop ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              What this does
            </button>
            {showExplainerTop && (
              <div className="mt-3 rounded-xl border border-border bg-card p-4 text-sm text-foreground/60 leading-relaxed max-w-xl">
                <p className="mb-2">When you paste this prompt into your AI coding agent, it will:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-foreground/50">
                  <li>Scan your machine for all coding project directories</li>
                  <li>Read each project&apos;s files to generate a compelling description and detect the tech stack</li>
                  <li>Show you each project and ask for your approval before uploading</li>
                  <li>Upload approved projects to your Narwhal profile</li>
                  <li>Install git hooks so future commits auto-sync to Narwhal</li>
                </ol>
              </div>
            )}
          </div>

          {/* Prompt block */}
          <div className="rounded-xl border border-border overflow-hidden mb-4" style={{ background: "rgba(6, 10, 18, 0.9)" }}>
            <pre className="p-5 text-[13px] text-foreground/60 font-mono leading-relaxed overflow-x-auto">
              {prompt}
            </pre>
          </div>

          {/* Bottom copy button */}
          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 ${
              copied
                ? "bg-accent/15 border border-accent/30 text-accent"
                : "bg-accent text-black hover:opacity-90"
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied! Now paste it into your coding agent" : "Copy to Clipboard"}
          </button>

          {/* Bottom accordion */}
          <div className="mt-5 mb-6">
            <button
              onClick={() => setShowExplainerBottom(!showExplainerBottom)}
              className="flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              {showExplainerBottom ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              What this does
            </button>
            {showExplainerBottom && (
              <div className="mt-3 rounded-xl border border-border bg-card p-4 text-sm text-foreground/60 leading-relaxed max-w-xl">
                <p className="mb-2">When you paste this prompt into your AI coding agent, it will:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-foreground/50">
                  <li>Scan your machine for all coding project directories</li>
                  <li>Read each project&apos;s files to generate a compelling description and detect the tech stack</li>
                  <li>Show you each project and ask for your approval before uploading</li>
                  <li>Upload approved projects to your Narwhal profile</li>
                  <li>Install git hooks so future commits auto-sync to Narwhal</li>
                </ol>
              </div>
            )}
          </div>

          {/* API Key display */}
          <div className="rounded-xl border border-border bg-card p-4 mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Key size={14} className="text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Your API Key</span>
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-sm font-mono text-foreground/70 break-all">{apiKey}</code>
              <button
                onClick={handleCopyKey}
                className="flex-shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors"
              >
                {keyCopied ? <Check size={12} className="inline" /> : <Copy size={12} className="inline" />}
                {keyCopied ? " Copied" : " Copy"}
              </button>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-muted">This key never expires. Keep it private.</span>
              <button
                onClick={regenerateKey}
                disabled={regenerating}
                className="inline-flex items-center gap-1.5 text-[11px] text-muted hover:text-foreground transition-colors disabled:opacity-50"
              >
                <RefreshCw size={11} className={regenerating ? "animate-spin" : ""} />
                {regenerating ? "Regenerating..." : "Regenerate Key"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Divider */}
      <div className="border-t border-border mb-10" />

      {/* Manual form */}
      <h2 className="text-lg font-semibold text-foreground mb-1">Or add a project manually</h2>
      <p className="text-sm text-muted mb-5">Create a project directly from here.</p>

      <form onSubmit={handleCreateProject} className="max-w-lg flex flex-col gap-4">
        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted outline-none focus:border-white/10 transition-colors"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted outline-none focus:border-white/10 transition-colors resize-none"
        />
        <input
          type="text"
          placeholder="Tech stack (comma separated, e.g. React, TypeScript, Supabase)"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted outline-none focus:border-white/10 transition-colors"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "active" | "published" | "stealth")}
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-white/10 transition-colors"
        >
          <option value="active">Active</option>
          <option value="published">Published</option>
          <option value="stealth">Stealth</option>
        </select>

        {formError && <p className="text-sm text-red-400">{formError}</p>}
        {formSuccess && <p className="text-sm text-accent">{formSuccess}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-white py-3 text-sm font-semibold text-black transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
