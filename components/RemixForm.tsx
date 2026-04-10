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

  const inputStyle = { background: "var(--bg-input)", border: "1px solid var(--border-default)", color: "var(--text-primary)" };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(15, 23, 42, 0.4)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-lg)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Remix Project</h2>
          <button onClick={onClose} className="transition-colors" style={{ color: "var(--text-muted)" }}>
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
            className="rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={inputStyle}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Tech stack (comma separated)"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={inputStyle}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "active" | "published" | "stealth")}
            className="rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={inputStyle}
          >
            <option value="active">Active</option>
            <option value="published">Published</option>
            <option value="stealth">Stealth</option>
          </select>

          {error && <p className="text-sm" style={{ color: "var(--accent-danger)" }}>{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full py-3 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: "var(--accent-primary)", color: "var(--text-inverse)" }}
          >
            {submitting ? "Creating..." : "Create Remix"}
          </button>
        </form>
      </div>
    </div>
  );
}
