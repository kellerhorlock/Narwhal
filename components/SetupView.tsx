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

  const prompt = `I need you to fully connect my coding projects to Narwhal (narwhal.codes), my builder profile.

IMPORTANT: Be thorough. For each project, I want a RICH profile — not just a name. Take your time.

STEP 0 — WARM UP:
curl -s ${syncUrl} > /dev/null 2>&1
Wait 2 seconds.

STEP 1 — FIND MY CLAUDE TOKEN USAGE:
Check if ~/.claude/usage.json or ~/.claude/stats.json or ~/.claude/projects/ exists.
If so, read the total token usage across all sessions. Store this number as MY_TOTAL_TOKENS.
Also check ~/.config/claude/ and ~/.local/share/claude/ as alternative locations.
If you find per-project token data, map it to project directories.
If no Claude usage data is found, set MY_TOTAL_TOKENS to 0.

STEP 2 — SCAN FOR PROJECTS:
Search these directories: ~/Desktop, ~/Documents, ~/Projects, ~/repos, ~/code, ~/dev
A project is any directory containing: package.json, Cargo.toml, pyproject.toml, go.mod, Gemfile, requirements.txt, pubspec.yaml, composer.json, or a .git directory.
Skip: node_modules, .next, __pycache__, venv, dist, build, hidden directories, and any project named 'vibefeed' or 'narwhal'.
Do NOT recurse deeper than 3 levels.

STEP 3 — FOR EACH PROJECT, GATHER RICH DATA:

A) BASIC INFO:
   - name: From package.json name field, or directory name
   - commits: Run \`git log --oneline 2>/dev/null | wc -l | tr -d ' '\`
   - lines: Run \`find . -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.py' -o -name '*.rs' -o -name '*.go' -o -name '*.swift' -o -name '*.java' -o -name '*.css' | grep -v node_modules | grep -v .next | xargs wc -l 2>/dev/null | tail -1 | tr -d ' ' | cut -d't' -f1\`
   - tech_stack: Detect from dependencies (package.json deps, requirements.txt, Cargo.toml, etc) AND file extensions. Be specific — say "Next.js" not just "JavaScript", say "Supabase" if you see @supabase in deps.

B) DESCRIPTION — THIS IS CRITICAL:
   Read the README.md (first 100 lines), the package.json description, and scan the main source files.
   Write a compelling 1-2 sentence description (under 200 chars) that would make a developer want to click.
   Write it like a YC pitch — what it does and why anyone should care. NOT generic. NOT just listing tech.
   BAD: "A Next.js application with Supabase backend"
   GOOD: "Smart scheduling for medical practices. Reduces no-shows by 40% with AI-powered reminders."

C) FIND A THUMBNAIL IMAGE:
   Check in order:
   1. Look for screenshots in README.md — any markdown image links like ![](screenshot.png) or ![](docs/preview.png)
   2. Check for /public/og-image.png, /public/og.png, /public/screenshot.png, /public/preview.png
   3. Check for any .png or .jpg in /public/, /assets/, /docs/, /screenshots/ (pick the first one)
   4. If the project has a live URL (see below), note it for thumbnail generation
   5. If nothing found, leave thumbnail_url as null (the app generates a gradient fallback)
   For any local image found, read it and convert to a base64 data URL: data:image/png;base64,[BASE64_DATA]

D) FIND LIVE URLs:
   Check in order for a deployed/live URL:
   1. package.json "homepage" field
   2. A CNAME file in the root or /public
   3. vercel.json or .vercel/project.json for Vercel deployments
   4. netlify.toml for Netlify deployments
   5. \`git remote -v\` and check if it's on GitHub — construct https://github.com/[user]/[repo]
   Store the live site URL as landing_url and the repo URL as download_url.

E) ESTIMATE TOKENS:
   If per-project Claude token data was found in Step 1, use that.
   Otherwise estimate: (lines_of_code * 3) + (commits * 500)
   This approximates AI-assisted development effort.

STEP 4 — PRESENT EACH PROJECT FOR APPROVAL:
Show each project like this:

📦 [name]
   [description]
   Stack: [tech_stack]
   [commits] commits · [lines] lines · ~[tokens] tokens
   🌐 Landing: [landing_url or "none found"]
   📂 Repo: [download_url or "none found"]
   🖼️ Image: [found/not found]
   Upload? (y/n)

STEP 5 — UPLOAD APPROVED PROJECTS:
For each approved project, run:

curl -s --max-time 30 -X POST '${syncUrl}' \\
  -H 'x-narwhal-key: ${apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "[NAME]",
    "description": "[DESCRIPTION]",
    "tech_stack": [TECH_ARRAY_AS_JSON],
    "status": "stealth",
    "tokens_used": [TOKENS],
    "commits": [COMMITS],
    "lines_changed": [LINES],
    "landing_url": "[LANDING_URL_OR_NULL]",
    "download_url": "[DOWNLOAD_URL_OR_NULL]",
    "thumbnail_url": "[THUMBNAIL_URL_OR_NULL]",
    "last_activity": "now()"
  }'

Important: make sure ALL string values in the JSON are properly escaped. Description must not contain unescaped quotes.
If a URL field is not found, use null (not the string "null").
If curl fails, wait 5 seconds and retry once.

STEP 6 — INSTALL AUTO-SYNC HOOKS:
For each uploaded project with a .git directory, create TWO hooks:

File: .git/hooks/post-commit
Content:
#!/bin/sh
COMMITS=$(git log --oneline | wc -l | tr -d ' ')
LINES=$(find . -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.py' -o -name '*.rs' -o -name '*.go' -o -name '*.swift' | grep -v node_modules | grep -v .next | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')
TOKENS=0
if [ -f ~/.claude/usage.json ]; then
  TOKENS=$(cat ~/.claude/usage.json | grep -o '"total_tokens":[0-9]*' | head -1 | cut -d: -f2)
fi
curl -s --max-time 10 -X PATCH '${syncUrl}' \\
  -H 'x-narwhal-key: ${apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d "{\\"name\\": \\"[PROJECT_NAME]\\", \\"commits\\": $COMMITS, \\"lines_changed\\": \${LINES:-0}, \\"tokens_used\\": \${TOKENS:-0}, \\"last_activity\\": \\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\\"}" 2>/dev/null &

Run: chmod +x .git/hooks/post-commit

File: .git/hooks/post-checkout
Same content as post-commit.
Run: chmod +x .git/hooks/post-checkout

STEP 7 — UPDATE MY PROFILE TOKEN COUNT:
If MY_TOTAL_TOKENS from Step 1 is > 0, update my profile:
curl -s --max-time 10 -X PATCH '${syncUrl}' \\
  -H 'x-narwhal-key: ${apiKey}' \\
  -H 'Content-Type: application/json' \\
  -d '{"update_profile_tokens": true, "total_tokens": [MY_TOTAL_TOKENS]}'

STEP 8 — SUMMARY:
✅ Done! [X] projects uploaded to Narwhal.
🔄 Auto-sync hooks installed on [Y] projects.
🔑 Your token usage has been synced.
📸 [Z] project thumbnails captured.

Your profile is live at narwhal.codes
Every future commit will automatically update your Narwhal profile. No action needed.`;

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
                  <li>Find your Claude token usage data (if available)</li>
                  <li>Scan your machine for all coding project directories</li>
                  <li>Gather rich data: description, tech stack, thumbnails, URLs, token estimates</li>
                  <li>Show you each project and ask for your approval before uploading</li>
                  <li>Upload approved projects with full metadata to your Narwhal profile</li>
                  <li>Install git hooks so future commits auto-sync stats</li>
                  <li>Sync your total token usage to your profile</li>
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
                  <li>Find your Claude token usage data (if available)</li>
                  <li>Scan your machine for all coding project directories</li>
                  <li>Gather rich data: description, tech stack, thumbnails, URLs, token estimates</li>
                  <li>Show you each project and ask for your approval before uploading</li>
                  <li>Upload approved projects with full metadata to your Narwhal profile</li>
                  <li>Install git hooks so future commits auto-sync stats</li>
                  <li>Sync your total token usage to your profile</li>
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
