"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Avatar from "./Avatar";
import NarwhalIcon from "./NarwhalIcon";
import type { Profile } from "@/lib/types";
import { X } from "lucide-react";

interface FollowListModalProps {
  profileId: string;
  mode: "followers" | "following";
  onClose: () => void;
  onUserClick: (username: string) => void;
}

export default function FollowListModal({ profileId, mode, onClose, onUserClick }: FollowListModalProps) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      if (mode === "followers") {
        const { data: follows } = await supabase
          .from("follows")
          .select("follower_id")
          .eq("following_id", profileId);
        if (follows && follows.length > 0) {
          const ids = follows.map((f) => f.follower_id);
          const { data: profiles } = await supabase
            .from("profiles")
            .select("*")
            .in("id", ids);
          setUsers(profiles || []);
        }
      } else {
        const { data: follows } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", profileId);
        if (follows && follows.length > 0) {
          const ids = follows.map((f) => f.following_id);
          const { data: profiles } = await supabase
            .from("profiles")
            .select("*")
            .in("id", ids);
          setUsers(profiles || []);
        }
      }

      setLoading(false);
    }
    load();
  }, [profileId, mode]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ background: "rgba(15, 23, 42, 0.4)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-[400px] max-h-[70vh] flex flex-col rounded-2xl"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-lg)" }}
      >
        <div className="flex items-center justify-between p-5 pb-0">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            {mode === "followers" ? "Followers" : "Following"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 pt-4">
          {loading ? (
            <div className="py-12 flex justify-center">
              <NarwhalIcon size={32} style={{ color: "var(--text-muted)" }} animate="pulse" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-sm py-8" style={{ color: "var(--text-secondary)" }}>
              {mode === "followers" ? "No followers yet" : "Not following anyone yet"}
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    onUserClick(user.username);
                    onClose();
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 text-left"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                >
                  <Avatar name={user.display_name || user.username} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {user.display_name || user.username}
                    </div>
                    <div className="text-xs font-mono truncate" style={{ color: "var(--text-muted)" }}>
                      @{user.username}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
