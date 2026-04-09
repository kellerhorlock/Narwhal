"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import SetupView from "@/components/SetupView";
import NarwhalIcon from "@/components/NarwhalIcon";
import type { Profile } from "@/lib/types";

export default function SetupPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setCurrentUserId(user.id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setCurrentUser(profile);
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <NarwhalIcon size={40} className="text-muted" animate="pulse" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        activeTab="setup"
        onTabChange={(tab) => router.push("/feed")}
        profile={currentUser}
      />
      <main className="ml-[240px] flex-1 overflow-y-auto min-h-screen" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.008) 0px, transparent 200px)" }}>
        <div className="mx-auto max-w-[860px] px-[52px] py-[44px]">
          <SetupView userId={currentUserId} />
        </div>
      </main>
    </div>
  );
}
