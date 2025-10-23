"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { formatNumber } from "@/lib/format-number";
import { formatDate } from "@/lib/format-date";
import Image from "next/image";

export interface RedditPostData {
  id: string;
  title: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  thumbnail?: string;
  is_video?: boolean;
  media?: {
    reddit_video?: {
      fallback_url?: string;
    };
  };
  preview?: {
    images?: {
      source?: {
        url?: string;
      };
    }[];
  };
}

interface RedditChild {
  data: RedditPostData;
}

interface RedditAPIData {
  children: RedditChild[];
  after: string | null;
  before: string | null;
}

interface RedditAPIResponse {
  data: RedditAPIData;
}

const PostCard: React.FC<{ post: RedditPostData }> = ({ post }) => {
  const {
    title,
    author,
    score,
    num_comments,
    created_utc,
    thumbnail,
    is_video,
    media,
    preview,
  } = post;

  const imageUrl =
    (thumbnail && thumbnail.startsWith("http") && thumbnail) ||
    (preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&")) ||
    null;

  const videoUrl =
    is_video && media?.reddit_video?.fallback_url
      ? media.reddit_video.fallback_url
      : null;

  return (
    // 1. Base (Mobile): Stacked (flex-col). SM and up: Side-by-side (sm:flex-row)
    <div className="bg-card border border-border rounded-sm mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-sm transition-all overflow-hidden">

      {/* Container for Image + Info - Base (Mobile): Stacked. SM and up: Side-by-side (sm:flex-row) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-4 w-full">

        {/* 2. Thumbnail Section - Only visible on SM and up */}
        <div className="hidden sm:block p-3 sm:p-4 shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-sm overflow-hidden bg-muted flex items-center justify-center">
            {videoUrl ? (
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src="/reddit_image.png"
                alt="Reddit-Placeholder"
                height={100}
                width={100} />
            )}
          </div>
        </div>

        {/* 3. Mobile-Specific Full-Width Media (hidden on sm and up) */}
        <div className="w-full h-44 bg-muted flex items-center justify-center sm:hidden overflow-hidden"> {/* Corrected the w-full class */}
          {videoUrl ? (
            <video
              src={videoUrl}
              // Applied h-full and object-contain to media for h-44 constraint
              className="w-full h-full object-contain"
              controls
              muted
              playsInline
              loop
              autoPlay
            />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              // Applied h-full and object-contain to media for h-44 constraint
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src="/reddit_image.png"
                alt="Reddit-Placeholder"
                height={100}
                width={100}
              />
            </div>
          )}
        </div>


        {/* 4. Post Info - Base (Mobile): Full width, padding. SM and up: smaller padding, flex-1 */}
        <div className="flex-1 w-full p-3 sm:py-4 sm:px-0">

          {/* Title */}
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-1 sm:mb-2">
            {title}
          </h3>

          {/* Posted By & Date - Base (Mobile): CHANGED to flex-row. SM and up: flex-row, justify-between */}
          <div className="text-[10px] sm:text-xs text-muted-foreground flex flex-row sm:flex-row items-center gap-2 sm:gap-2 sm:justify-between">
            {/* Posted By */}
            <div className="flex items-center gap-1 sm:gap-2">
              <p className="text-muted-foreground font-bold">Posted By</p>
              <Image
                src="https://www.redditstatic.com/avatars/avatar_default_02_0079D3.png"
                alt="author"
                height={100}
                width={100}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded-full"
              />
              <span className="text-foreground font-bold tracking-tight truncate max-w-[100px] sm:max-w-none">
                {author}
              </span>
            </div>
            {/* Date - Added a separator and adjusted margin for mobile alignment */}
            <span className="text-gray-400 mx-1 sm:hidden">|</span>
            <span className="font-medium tracking-tight text-gray-400 sm:mr-2.5">
              {formatDate(created_utc)}
            </span>
          </div>

          {/* 5. Mobile-Only Action Bar (Comment/Share/More) - Hidden on SM and up */}
          <div className="flex sm:hidden items-center justify-around py-2 border-y border-border my-2">
            <div className="flex items-center gap-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">
                {formatNumber(num_comments)} Comments
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              <Share2 className="h-4 w-4" />
              <span className="text-xs font-medium">Share</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              <MoreHorizontal className="h-4 w-4" />
              <span className="text-xs font-medium">More</span>
            </div>
          </div>
        </div>

        {/* 6. Desktop-Only Action Bar (Comment/Share/More) - Hidden on mobile, visible on MD and up */}
        <div className="hidden md:flex flex-col items-center justify-center px-3 shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">{formatNumber(num_comments)} Comments</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Share2 className="h-4 w-4" />
            <span className="text-sm">Share</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">More</span>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-16 border-t sm:border-t-0 sm:border-l border-border flex sm:flex-col items-center justify-between sm:justify-center space-x-4 sm:space-x-0 sm:space-y-5 p-2 sm:p-0">
        <div className="bg-[#ff4400]/10 h-[1.5rem] w-8 sm:w-10 rounded-xs flex items-center justify-center">
          <ChevronUp
            className="text-[#ff4400] h-4 sm:h-5 w-4 sm:w-5 cursor-pointer"
            strokeWidth={2.5}
          />
        </div>
        <span className="font-semibold text-foreground text-xs sm:text-sm">
          {formatNumber(score)}
        </span>
        <div className="bg-[#ff4400]/10 h-[1.5rem] w-8 sm:w-10 rounded-xs flex items-center justify-center">
          <ChevronDown
            className="text-[#ff4400] h-4 sm:h-5 w-4 sm:w-5 cursor-pointer"
            strokeWidth={2.5}
          />

        </div>

        {/* Spacer for desktop vertical layout - now using hidden sm:block */}
        <div className="hidden sm:block"></div>
      </div>
    </div>
  );
};

const RedditPostCardList: React.FC = () => {
  const [posts, setPosts] = useState<RedditPostData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sort, setSort] = useState<"hot" | "new" | "controversial" | "rising" | "top">("hot");
  const [after, setAfter] = useState<string | null>(null);
  const [before, setBefore] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);

  const fetchPosts = async (
    selectedSort: typeof sort,
    direction: "next" | "prev" | "new" = "new"
  ) => {
    setIsLoading(true);
    let url = `https://www.reddit.com/r/popular/${selectedSort}.json?limit=6`;

    if (direction === "new") {
      url += `&count=0`;
    } else if (direction === "next" && after) {
      url += `&after=${after}&count=${count}`;
    } else if (direction === "prev" && before) {
      url += `&before=${before}&count=${count}`;
    }

    try {
      const { data } = await axios.get<RedditAPIResponse>(url);
      const newPosts: RedditPostData[] = data.data.children.map((p) => p.data);

      setPosts(newPosts);
      setAfter(data.data.after);
      setBefore(data.data.before);

      if (direction === "new") setCount(newPosts.length);
      else if (direction === "next") setCount((c) => c + newPosts.length);
      else if (direction === "prev") setCount((c) => Math.max(0, c - newPosts.length));
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setIsLoading(false);
      document
        .querySelector(".post-scroll-container")
        ?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchPosts(sort, "new");
  }, [sort]);

  const filters: typeof sort[] = ["hot", "new", "controversial", "rising", "top"];

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 relative h-screen flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 bg-background z-20 sticky top-0 py-2 sm:py-3 gap-2 sm:gap-0">
        <h2 className="text-base sm:text-lg font-semibold text-foreground text-center sm:text-left">
          Popular
        </h2>
        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSort(f)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-xs transition-all ${sort === f
                ? "bg-muted font-semibold text-foreground"
                : "text-muted-foreground hover:bg-muted"
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent post-scroll-container">
        {isLoading ? (
          <div className="flex min-h-[40vh] w-full items-center justify-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="flex w-20 h-20 sm:w-24 sm:h-24 md:w-40 md:h-40 object-cover"
            >
              <source src="/Reddit-Loader.mp4" type="video/mp4" />
            </video>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* Pagination */}
      {!isLoading && posts.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center bg-background py-2 sm:py-3 sticky bottom-0 z-20 gap-2 sm:gap-0">
          <button
            onClick={() => fetchPosts(sort, "prev")}
            disabled={!before}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-foreground bg-card border border-border rounded-md shadow-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            Previous
          </button>

          <span className="text-xs sm:text-sm text-muted-foreground">
            Page {Math.max(1, Math.ceil(count / 6))}
          </span>

          <button
            onClick={() => fetchPosts(sort, "next")}
            disabled={!after}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-foreground bg-card border border-border rounded-md shadow-sm hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RedditPostCardList;
