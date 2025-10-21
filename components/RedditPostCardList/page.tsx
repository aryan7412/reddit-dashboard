"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { formatNumber } from "@/lib/format-number";
import { formatDate } from "@/lib/format-date";

// --- TYPES ---

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

// --- POST CARD COMPONENT ---

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
    <div className="bg-white border border-gray-200 rounded-xl mb-4 flex items-center justify-between hover:shadow-sm transition-all">
      <div className="flex items-center gap-4 w-full">
        {/* Thumbnail */}
        <div className="p-4">
          <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
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
              <div className="text-gray-400 text-xs">No image</div>
            )}
          </div>
        </div>

        {/* Post Info */}
        <div className="flex-1 py-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
            {title}
          </h3>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <p className="text-gray-500 font-bold">Posted By</p>
            <img
              src="https://www.redditstatic.com/avatars/avatar_default_02_0079D3.png"
              alt="author"
              className="w-5 h-5 rounded-full"
            />
            <span className="text-gray-700 font-bold tracking-tight">{author}</span>
            <span className="text-gray-300 font-medium tracking-tight">
              {formatDate(created_utc)}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex flex-col items-center justify-center p-4 border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">{formatNumber(num_comments)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Share2 className="h-4 w-4" />
            <span className="text-sm">Share</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
            <span className="text-sm">More</span>
          </div>
        </div>

        {/* Vote Panel */}
        <div className="w-16 border-l border-gray-100 flex flex-col items-center justify-center space-y-2">
          <div className="bg-[#ff4400]/10 h-[1.35rem] w-10 rounded-sm">
            <ChevronUp
              className="text-[#ff4400] h-5 w-5 cursor-pointer mx-auto my-auto"
              strokeWidth={2.5}
            />
          </div>
          <span className="font-semibold text-gray-700 text-sm">
            {formatNumber(score)}
          </span>
          <div className="bg-[#ff4400]/10 h-[1.35rem] w-10 rounded-sm">
            <ChevronDown
              className="text-[#ff4400] h-5 w-5 cursor-pointer mx-auto my-auto"
              strokeWidth={2.5}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

const RedditPostCardList: React.FC = () => {
  const [posts, setPosts] = useState<RedditPostData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sort, setSort] = useState<
    "hot" | "new" | "controversial" | "rising" | "top"
  >("hot");

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
      const res = await fetch(url);
      const data: RedditAPIResponse = await res.json();

      const newPosts: RedditPostData[] = data.data.children.map((p) => p.data);

      setPosts(newPosts);
      setAfter(data.data.after);
      setBefore(data.data.before);

      if (direction === "new") {
        setCount(newPosts.length);
      } else if (direction === "next") {
        setCount((prevCount) => prevCount + newPosts.length);
      } else if (direction === "prev") {
        setCount((prevCount) => Math.max(0, prevCount - newPosts.length));
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(sort, "new");
  }, [sort]);

  const filters: typeof sort[] = ["hot", "new", "controversial", "rising", "top"];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Popular</h2>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSort(f)}
              className={`px-3 py-1 text-sm rounded-md transition-all ${
                sort === f
                  ? "bg-gray-100 font-semibold text-gray-800"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="flex w-40 h-40 object-cover"
          >
            <source src="/Reddit-Loader.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}

      {/* Pagination */}
      {!isLoading && posts.length > 0 && (
        <div className="flex justify-between items-center mt-6 mb-10">
          <button
            onClick={() => fetchPosts(sort, "prev")}
            disabled={!before}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {Math.max(1, Math.ceil(count / 6))}
          </span>

          <button
            onClick={() => fetchPosts(sort, "next")}
            disabled={!after}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RedditPostCardList;
