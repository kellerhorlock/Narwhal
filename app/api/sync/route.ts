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

  const { name, description, tech_stack, status, tokens_used, commits, lines_changed } = body as {
    name?: string;
    description?: string;
    tech_stack?: string[];
    status?: string;
    tokens_used?: number;
    commits?: number;
    lines_changed?: number;
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
    tokens_used: tokens_used || 0,
    commits: commits || 0,
    lines_changed: lines_changed || 0,
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

  const { name, ...updates } = body as {
    name?: string;
    [key: string]: unknown;
  };

  if (!name) {
    return Response.json({ error: "name is required to identify the project" }, { status: 400 });
  }

  const dbUpdates: Record<string, unknown> = { ...updates };

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
