'use client';

import * as React from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface RedditPost {
  id: string;
  title: string;
  url: string;
  subreddit: string;
}

interface RedditChild {
  data: {
    id?: string;
    title?: string;
    permalink?: string;
    subreddit_name_prefixed?: string;
    subreddit?: string;
  };
}

interface RedditAPIResponse {
  data: {
    children: RedditChild[];
  };
}

const SearchBar = () => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<RedditPost[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/reddit?q=${encodeURIComponent(query)}`,
          { headers: { Accept: "application/json" }, signal: controller.signal }
        );


        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data: RedditAPIResponse = await response.json();

        const items = (data?.data?.children ?? []).map((c) => {
          const d = c.data;
          return {
            id: d.id ?? Math.random().toString(36),
            title: d.title ?? "Untitled",
            url: d.permalink ? `https://www.reddit.com${d.permalink}` : "#",
            subreddit: d.subreddit_name_prefixed ?? d.subreddit ?? "",
          };
        });

        setResults(items);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Failed to search");
        }
        setResults([]);
      }
      finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <div className="space-y-5">
      <div className="flex items-center w-[350px] relative">
        <Input
          placeholder="Find community or post"
          className="h-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search Reddit"
        />
        {(query || loading || error || results.length > 0) && (
          <div className="absolute top-10 left-0 right-0 z-50 rounded-md border bg-popover text-popover-foreground shadow-md max-h-80 overflow-auto">
            {loading && (
              <div className="px-3 py-2 text-sm text-muted-foreground">Searching…</div>
            )}
            {error && !loading && (
              <div className="px-3 py-2 text-sm text-destructive">{error}</div>
            )}
            {!loading && !error && results.length === 0 && query && (
              <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
            )}
            {!loading &&
              !error &&
              results.map((r) => (
                <Link
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="font-medium line-clamp-2">{r.title}</div>
                  {r.subreddit && (
                    <div className="text-xs text-muted-foreground">{r.subreddit}</div>
                  )}
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
