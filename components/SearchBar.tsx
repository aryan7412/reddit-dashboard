'use client'

import * as React from "react";
import { Input } from "@/components/ui/input"
import Link from "next/link";

const SearchBar = () => {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<Array<{ id: string; title: string; url: string; subreddit: string }>>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Debounced search
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
                const res = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=10`, {
                    signal: controller.signal,
                    headers: {
                        "Accept": "application/json",
                    },
                    cache: "no-store",
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const items = (data?.data?.children ?? []).map((c: any) => {
                    const d = c?.data;
                    return {
                        id: d?.id ?? Math.random().toString(36),
                        title: d?.title ?? "Untitled",
                        url: d?.permalink ? `https://www.reddit.com${d.permalink}` : "#",
                        subreddit: d?.subreddit_name_prefixed ?? d?.subreddit ?? "",
                    };
                });
                setResults(items);
            } catch (e: any) {
                if (e?.name !== "AbortError") {
                    setError(e?.message || "Failed to search");
                    setResults([]);
                }
            } finally {
                setLoading(false);
            }
        }, 400); // debounce

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
                        {!loading && !error && results.map((r) => (
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
    )
}

export default SearchBar
