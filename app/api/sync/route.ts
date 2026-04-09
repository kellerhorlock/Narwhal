import { supabaseAdmin } from "@/lib/supabase-admin";
import { NextRequest } from "next/server";

async function authenticateKey(request: NextRequest) {
  const apiKey = request.headers.get("x-narwhal-key");
  if (!apiKey) return null;

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("narwhal_api_key", apiKey)
    .single();

  return data?.id || null;
}

export async function POST(request: NextRequest) {
  const userId = await authenticateKey(request);
  if (!userId) {
    return Response.json({ error: "Invalid API key" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    name, description, tech_stack, status, commits,
    landing_url, download_url, thumbnail_url,
  } = body as {
    name?: string;
    description?: string;
    tech_stack?: string[];
    status?: string;
    commits?: number;
    landing_url?: string | null;
    download_url?: string | null;
    thumbnail_url?: string | null;
  };

  if (!name) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("projects").insert({
    user_id: userId,
    name,
    description: description || null,
    tech_stack: tech_stack || [],
    status: status || "stealth",
    commits: commits || 0,
    landing_url: landing_url || null,
    download_url: download_url || null,
    thumbnail_url: thumbnail_url || null,
    last_activity: new Date().toISOString(),
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const userId = await authenticateKey(request);
  if (!userId) {
    return Response.json({ error: "Invalid API key" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, commits, last_activity } = body as {
    name?: string;
    commits?: number;
    last_activity?: string;
  };

  if (!name) {
    return Response.json({ error: "name is required to identify the project" }, { status: 400 });
  }

  const dbUpdates: Record<string, unknown> = {};
  if (commits !== undefined) dbUpdates.commits = commits;
  if (last_activity) dbUpdates.last_activity = last_activity;

  const { error } = await supabaseAdmin
    .from("projects")
    .update(dbUpdates)
    .eq("name", name)
    .eq("user_id", userId);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 200 });
}
