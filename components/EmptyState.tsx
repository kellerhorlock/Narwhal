"use client";

import NarwhalIcon from "./NarwhalIcon";

interface EmptyStateProps {
  title: string;
  message: string;
  actions?: { label: string; onClick: () => void; primary?: boolean }[];
}

export default function EmptyState({ title, message, actions }: EmptyStateProps) {
  return (
    <div className="rounded-xl py-20 px-8 text-center" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-card)" }}>
      <NarwhalIcon size={64} className="mx-auto mb-5" style={{ color: "var(--text-muted)" }} animate="float" />
      <p className="text-[20px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>{title}</p>
      <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: "var(--text-secondary)" }}>{message}</p>
      {actions && actions.length > 0 && (
        <div className="flex items-center justify-center gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="rounded-full px-5 py-2 text-sm font-semibold transition-all duration-150"
              style={action.primary
                ? { background: "var(--accent-primary)", color: "var(--text-inverse)" }
                : { border: "1px solid var(--border-strong)", color: "var(--text-primary)" }
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
