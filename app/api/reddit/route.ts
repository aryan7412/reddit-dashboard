import { NextResponse } from "next/server";
import { oauthFetch } from "@/lib/reddit";

// Ensure this route runs on the Node.js runtime (not Edge) for better compatibility with Reddit
export const runtime = "nodejs";
// Avoid static rendering/caching; always run dynamically
export const dynamic = "force-dynamic";

// Simple in-memory cache to reduce rate-limiting
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60; // 1 minute

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Extract query parameters with defaults
  const sort = searchParams.get("sort") || "hot";
  const after = searchParams.get("after") || "";
  const before = searchParams.get("before") || "";
  const count = searchParams.get("count") || "0";
  const q = (searchParams.get("q") || "").trim();

  // Build target Reddit URL based on whether this is a search or listing request
  const isSearch = q.length > 0;
  const redditUrl = isSearch
    ? `https://oauth.reddit.com/search.json?q=${encodeURIComponent(q)}&limit=10&raw_json=1`
    : `https://oauth.reddit.com/r/popular/${sort}.json?limit=6&after=${after}&before=${before}&count=${count}&raw_json=1`;
  const cacheKey = isSearch
    ? `search-${q}`
    : `${sort}-${after}-${before}-${count}`;

  // ✅ Serve from cache if available and fresh
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    // Fetch from Reddit API with proper headers (with retries for transient failures)
    const doFetch = async () => oauthFetch(redditUrl, { method: "GET" });

    let res: Response | null = null;
    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        res = await doFetch();
        if (res.ok) break;
        // Retry on transient upstream errors
        if ([502, 503, 504].includes(res.status) && attempt < maxRetries) {
          const delay = 250 * Math.pow(2, attempt);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        break;
      } catch (e) {
        if (attempt < maxRetries) {
          const delay = 250 * Math.pow(2, attempt);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        throw e;
      }
    }
    if (!res) throw new Error("No response from fetch");

    // Handle rate limiting gracefully
    if (res.status === 429) {
      console.warn("Rate limited by Reddit API");
      return NextResponse.json(
        { error: "Rate limited by Reddit. Try again later." },
        { status: 429 }
      );
    }

    // Handle other HTTP errors
    if (!res.ok) {
      const text = await res.text();
      console.error("Reddit API returned error:", res.status, text);
      // Propagate upstream status to the client for easier debugging
      return NextResponse.json(
        {
          error: "Upstream Reddit API error",
          upstream_status: res.status,
          details: text?.slice(0, 500),
          url: redditUrl,
        },
        { status: res.status }
      );
    }

    const data = await res.json();

    // ✅ Cache the response
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Reddit API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from Reddit", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
