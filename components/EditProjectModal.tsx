"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { generateGradientSVG } from "@/lib/helpers";
import type { Project } from "@/lib/types";
import { X, Upload, RefreshCw } from "lucide-react";

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
  onSaved: (updated: Project) => void;
}

export default function EditProjectModal({ project, onClose, onSaved }: EditProjectModalProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [landingUrl, setLandingUrl] = useState(project.landing_url || "");
  const [downloadUrl, setDownloadUrl] = useState(project.download_url || "");
  const [techStack, setTechStack] = useState((project.tech_stack || []).join(", "));
  const [status, setStatus] = useState<"active" | "published" | "stealth">(project.status);
  const [thumbnailUrl, setThumbnailUrl] = useState(project.thumbnail_url || "");
  const [hiddenStats, setHiddenStats] = useState<string[]>(project.hidden_stats || []);
  const [saving, setSaving] = useState(false);
  const [gradientSeed, setGradientSeed] = useState(project.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleRegenerate() {
    setThumbnailUrl("");
    setGradientSeed(project.name + "-" + Math.random().toString(36).slice(2));
  }

  function toggleStat(stat: string) {
    setHiddenStats((prev) =>
      prev.includes(stat) ? prev.filter((s) => s !== stat) : [...prev, stat]
    );
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();

    const updates: Record<string, unknown> = {
      name,
      description: description || null,
      landing_url: landingUrl || null,
      download_url: downloadUrl || null,
      tech_stack: techStack.split(",").map((t) => t.trim()).filter(Boolean),
      status,
      hidden_stats: hiddenStats,
      thumbnail_url: thumbnailUrl || null,
    };

    const { error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", project.id);

    setSaving(false);

    if (!error) {
      onSaved({
        ...project,
        ...updates,
        tech_stack: updates.tech_stack as string[],
        status: updates.status as "active" | "published" | "stealth",
      } as Project);
    }
  }

  const allStats = [
    { key: "tokens", label: "Tokens Used" },
    { key: "commits", label: "Commits" },
    { key: "lines_changed", label: "Lines Changed" },
    { key: "downloads", label: "Downloads" },
  ];

  const inputStyle = { background: "var(--bg-input)", border: "1px solid var(--border-default)", color: "var(--text-primary)" };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ background: "rgba(15, 23, 42, 0.4)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl p-6"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-lg)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors duration-150"
          style={{ color: "var(--text-muted)" }}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-5" style={{ color: "var(--text-primary)" }}>Edit Project</h2>

        {/* Image section */}
        <div className="mb-5">
          <div
            className="w-full h-[200px] rounded-xl bg-cover bg-center mb-3"
            style={{
              backgroundImage: thumbnailUrl
                ? `url("${thumbnailUrl}")`
                : `url("${generateGradientSVG(gradientSeed, 600, 200)}")`,
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors duration-150"
              style={{ border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
            >
              <Upload size={14} />
              Change Image
            </button>
            <button
              onClick={handleRegenerate}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors duration-150"
              style={{ border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
            >
              <RefreshCw size={14} />
              Regenerate
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        </div>

        <label className="block mb-4">
          <span className="text-[11px] font-medium uppercase tracking-widest mb-1.5 block" style={{ color: "var(--text-muted)" }}>Project Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-150"
            style={inputStyle}
          />
        </label>

        <label className="block mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Description</span>
            <span className="text-xs" style={{ color: description.length > 450 ? "var(--accent-warm)" : "var(--text-muted)" }}>
              {description.length}/500
            </span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            rows={3}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-150 resize-none"
            style={inputStyle}
          />
        </label>

        <label className="block mb-4">
          <span className="text-[11px] font-medium uppercase tracking-widest mb-1.5 block" style={{ color: "var(--text-muted)" }}>Landing Page URL</span>
          <input
            type="url"
            value={landingUrl}
            onChange={(e) => setLandingUrl(e.target.value)}
            placeholder="https://your-project.com"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-150"
            style={inputStyle}
          />
        </label>

        <label className="block mb-4">
          <span className="text-[11px] font-medium uppercase tracking-widest mb-1.5 block" style={{ color: "var(--text-muted)" }}>Download URL</span>
          <input
            type="url"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            placeholder="Link to download or repo"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-150"
            style={inputStyle}
          />
        </label>

        <label className="block mb-4">
          <span className="text-[11px] font-medium uppercase tracking-widest mb-1.5 block" style={{ color: "var(--text-muted)" }}>Tech Stack</span>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="React, TypeScript, Supabase"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-150"
            style={inputStyle}
          />
        </label>

        <label className="block mb-5">
          <span className="text-[11px] font-medium uppercase tracking-widest mb-1.5 block" style={{ color: "var(--text-muted)" }}>Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "active" | "published" | "stealth")}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors duration-150"
            style={inputStyle}
          >
            <option value="active">Building</option>
            <option value="published">Published</option>
            <option value="stealth">Stealth</option>
          </select>
        </label>

        <div className="mb-6">
          <span className="text-[11px] font-medium uppercase tracking-widest mb-3 block" style={{ color: "var(--text-muted)" }}>Stat Visibility</span>
          <div className="space-y-2">
            {allStats.map((stat) => {
              const isHidden = hiddenStats.includes(stat.key);
              return (
                <button
                  key={stat.key}
                  onClick={() => toggleStat(stat.key)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors duration-150"
                  style={{ border: "1px solid var(--border-default)" }}
                >
                  <span style={{ color: isHidden ? "var(--text-muted)" : "var(--text-primary)" }}>
                    {stat.label}
                  </span>
                  <div
                    className="relative w-9 h-5 rounded-full transition-colors duration-200"
                    style={{ background: isHidden ? "var(--border-strong)" : "var(--accent-primary)" }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                      style={{ transform: isHidden ? "translateX(2px)" : "translateX(18px)" }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-opacity disabled:opacity-40"
            style={{ background: "var(--accent-primary)", color: "var(--text-inverse)" }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={onClose}
            className="rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150"
            style={{ border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
