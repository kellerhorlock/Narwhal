"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Project, Profile } from "@/lib/types";
import { X } from "lucide-react";

interface RemixFormProps {
  originalProject: Project;
  originalProfile: Profile;
  currentUserId: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function RemixForm({ originalProject, originalProfile, currentUserId, onClose, onCreated }: RemixFormProps) {
  const builderHandle = originalProfile.username;
  const [name, setName] = useState(`${originalProject.name} Remix`);
  const [description, setDescription] = useState(
    `Inspired by @${builderHandle}'s ${originalProject.name}. `
  );
  const [techStack, setTechStack] = useState(
    (originalProject.tech_stack || []).join(", ")
  );
  const [status, setStatus] = useState<"active" | "published" | "stealth">("active");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("projects").insert({
      user_id: currentUserId,
      name,
      description,
      tech_stack: techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      status,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
    } else {
      onCreated();
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-border p-6" style={{ background: "rgba(8, 14, 24, 0.98)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">Remix Project</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            placeholder="Tech stack (comma separated)"
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

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-white py-3 text-sm font-semibold text-black transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Remix"}
          </button>
        </form>
      </div>
    </div>
  );
}
