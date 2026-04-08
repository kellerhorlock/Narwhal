"use client";

import NarwhalIcon from "./NarwhalIcon";

interface EmptyStateProps {
  title: string;
  message: string;
  actions?: { label: string; onClick: () => void; primary?: boolean }[];
}

export default function EmptyState({ title, message, actions }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-border bg-card py-20 px-8 text-center">
      <NarwhalIcon size={64} className="mx-auto mb-5 text-muted/30 animate-narwhal-float" />
      <p className="text-[20px] font-semibold text-foreground mb-2">{title}</p>
      <p className="text-sm text-muted mb-8 max-w-sm mx-auto">{message}</p>
      {actions && actions.length > 0 && (
        <div className="flex items-center justify-center gap-3">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-150 ${
                action.primary
                  ? "bg-white text-black hover:opacity-80"
                  : "border border-border text-foreground hover:border-muted"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
