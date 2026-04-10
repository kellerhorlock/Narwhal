"use client";

import { useEffect, useRef } from "react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

interface ContextMenuProps {
  x: number;
  y: number;
  isPublished: boolean;
  onPublish?: () => void;
  onMoveToStealth?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function ContextMenu({ x, y, isPublished, onPublish, onMoveToStealth, onEdit, onDelete, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const menuStyle: React.CSSProperties = {
    position: "fixed",
    top: y,
    left: x,
    zIndex: 9999,
  };

  const items = isPublished
    ? [
        { label: "Edit", icon: Pencil, onClick: onEdit },
        { label: "Move to Stealth", icon: EyeOff, onClick: onMoveToStealth! },
        { label: "Delete", icon: Trash2, onClick: onDelete, danger: true },
      ]
    : [
        { label: "Publish", icon: Eye, onClick: onPublish! },
        { label: "Edit", icon: Pencil, onClick: onEdit },
        { label: "Delete", icon: Trash2, onClick: onDelete, danger: true },
      ];

  return (
    <div ref={ref} style={menuStyle}>
      <div
        className="rounded-xl py-1.5 min-w-[180px]"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {items.map((item) => (
          <button
            key={item.label}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
              onClose();
            }}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors duration-100"
            style={{ color: item.danger ? "var(--accent-danger)" : "var(--text-primary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = item.danger ? "rgba(220,38,38,0.06)" : "var(--bg-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
          >
            <item.icon size={14} />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
