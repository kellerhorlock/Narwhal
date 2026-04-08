import { supabaseAdmin } from "@/lib/supabase-admin";
import Anthropic from "@anthropic-ai/sdk";

const CACHE_HOURS = 4;

const CATEGORIES = ["Frontier", "Model Release", "Vibe Coding", "Industry", "Research", "Culture"];

async function fetchCachedNews() {
  const { data } = await supabaseAdmin
    .from("news_feed")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  return data || [];
}

async function isCacheStale(): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("news_feed")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) return true;

  const age = Date.now() - new Date(data.created_at).getTime();
  return age > CACHE_HOURS * 60 * 60 * 1000;
}

async function generateFreshNews(): Promise<Array<{
  title: string;
  description: string;
  source: string;
  category: string;
  url: string;
  timestamp: string;
}> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "placeholder") {
    console.log("[news] No valid ANTHROPIC_API_KEY, skipping generation");
    return null;
  }

  try {
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: `You are a news curator for Narwhal, a social platform for AI-native builders and vibe coders. Find the latest breaking AI news, frontier model releases, vibe coding discourse, AGI/ASI developments, and spicy AI culture takes. Focus on what's actually being discussed RIGHT NOW on Twitter/X, Hacker News, and AI research circles.

Return ONLY a valid JSON array of exactly 10 news items. No markdown, no explanation, just the JSON array.

Each item must have these fields:
- "title": string (compelling headline, 60-100 chars)
- "description": string (1 sentence context, under 150 chars)
- "source": string (e.g. "Anthropic Blog", "@karpathy", "Hacker News", "arXiv")
- "category": string (one of: "Frontier", "Model Release", "Vibe Coding", "Industry", "Research", "Culture")
- "url": string (a plausible URL for the source)
- "timestamp": string (relative time like "2h ago", "5h ago", "1d ago")

Make headlines feel urgent and real — like whisper network intel, not PR. Mix categories.`,
      messages: [
        {
          role: "user",
          content: "Generate 10 breaking AI news items that reflect what's being discussed in AI circles right now. Return only the JSON array.",
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log("[news] Failed to parse JSON from response");
      return null;
    }

    const items = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!Array.isArray(items) || items.length === 0) return null;

    return items.map((item: Record<string, unknown>) => ({
      title: String(item.title || ""),
      description: String(item.description || ""),
      source: String(item.source || ""),
      category: CATEGORIES.includes(String(item.category)) ? String(item.category) : "Frontier",
      url: String(item.url || "https://x.com"),
      timestamp: String(item.timestamp || "1h ago"),
    }));
  } catch (err) {
    console.error("[news] Anthropic API error:", err);
    return null;
  }
}

export async function GET() {
  try {
    const stale = await isCacheStale();

    if (stale) {
      console.log("[news] Cache is stale, generating fresh content...");
      const freshNews = await generateFreshNews();

      if (freshNews && freshNews.length > 0) {
        // Clear old cache and insert new entries
        await supabaseAdmin.from("news_feed").delete().neq("id", "00000000-0000-0000-0000-000000000000");

        const rows = freshNews.map((item) => ({
          title: item.title,
          description: item.description,
          source: item.source,
          category: item.category,
          url: item.url,
          timestamp: item.timestamp,
        }));

        await supabaseAdmin.from("news_feed").insert(rows);

        // Return the fresh entries with type field
        const result = freshNews.map((item, i) => ({
          id: `live-${i}`,
          type: "news" as const,
          ...item,
        }));

        return Response.json(result);
      }
    }

    // Return cached entries
    const cached = await fetchCachedNews();

    if (cached.length > 0) {
      const result = cached.map((row) => ({
        id: row.id,
        type: "news" as const,
        title: row.title,
        description: row.description || "",
        source: row.source || "",
        category: row.category || "Frontier",
        url: row.url || "",
        timestamp: row.timestamp || "",
      }));

      return Response.json(result);
    }

    // No cache and no fresh content — return empty (client will use fallback)
    return Response.json([]);
  } catch (err) {
    console.error("[news] Route error:", err);
    return Response.json([], { status: 500 });
  }
}
