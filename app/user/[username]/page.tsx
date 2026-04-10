"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import ProfileView from "@/components/ProfileView";
import ProjectDetail from "@/components/ProjectDetail";
import NarwhalIcon from "@/components/NarwhalIcon";
import type { Profile, Project } from "@/lib/types";

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [projectDetail, setProjectDetail] = useState<{ project: Project; profile: Profile } | null>(null);

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

  async function handleProjectClick(project: Project) {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", project.user_id)
      .single();
    if (profile) {
      setProjectDetail({ project, profile });
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <NarwhalIcon size={40} style={{ color: "var(--text-muted)" }} animate="pulse" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="hidden md:block">
        <Sidebar
          activeTab="profile"
          onTabChange={(tab) => {
            if (tab === "profile") router.push("/feed");
            else router.push(`/feed`);
          }}
          profile={currentUser}
        />
      </div>
      <main className="md:ml-[240px] flex-1 overflow-y-auto min-h-screen">
        <div className="mx-auto max-w-[860px] px-4 py-6 md:px-[52px] md:py-[44px]">
          {projectDetail ? (
            <ProjectDetail
              project={projectDetail.project}
              profile={projectDetail.profile}
              isOwner={projectDetail.project.user_id === currentUserId}
              onBack={() => setProjectDetail(null)}
              onUserClick={(u) => router.push(`/user/${u}`)}
              currentUserId={currentUserId}
            />
          ) : (
            <ProfileView
              username={username}
              currentUserId={currentUserId}
              onProjectClick={handleProjectClick}
            />
          )}
        </div>
      </main>
    </div>
  );
}
