'use client'

import React, { useState } from 'react';

interface Subreddit {
  name: string;
  avatar: string;
  count: number;
}

const favorites: Subreddit[] = [
  { name: 'r/funymore', avatar: 'https://placehold.co/32x32/FFDDC1/8B5CF6?text=F', count: 156 },
  { name: 'r/breadkingnews', avatar: 'https://placehold.co/32x32/E0E7FF/4F46E5?text=B', count: 12 },
  { name: 'r/lovestory', avatar: 'https://placehold.co/32x32/FEE2E2/DC2626?text=L', count: 0 },
  { name: 'r/gamingfun', avatar: 'https://placehold.co/32x32/D1FAE5/059669?text=G', count: 8 },
];

const redditFeeds: Subreddit[] = [
  { name: 'r/moview', avatar: 'https://placehold.co/32x32/FBCFE8/DB2777?text=M', count: 4 },
  { name: 'r/gaming', avatar: 'https://placehold.co/32x32/E0F2FE/0891B2?text=G', count: 0 },
  { name: 'r/pics', avatar: 'https://placehold.co/32x32/FEF3C7/F59E0B?text=P', count: 32 },
  { name: 'r/gifs', avatar: 'https://placehold.co/32x32/F3E8FF/8B5CF6?text=G', count: 0 },
];

const community: Subreddit[] = [
    { name: 'r/funymore', avatar: 'https://placehold.co/32x32/FFDDC1/8B5CF6?text=F', count: 0 },
    { name: 'r/breadkingnews', avatar: 'https://placehold.co/32x32/E0E7FF/4F46E5?text=B', count: 0 },
    { name: 'r/gaming', avatar: 'https://placehold.co/32x32/D1FAE5/059669?text=G', count: 43 },
    { name: 'r/lovestory', avatar: 'https://placehold.co/32x32/FEE2E2/DC2626?text=L', count: 12 },
];


// Subreddit Item Component
const SubredditItem: React.FC<{ subreddit: Subreddit }> = ({ subreddit }) => (
  <a href="#" className="flex items-center justify-between py-1.25 px-3 rounded-lg hover:bg-muted transition-colors duration-150">
    <div className="flex items-center space-x-3">
      <img src={subreddit.avatar} alt={`${subreddit.name} avatar`} className="w-7 h-7 rounded-full object-cover" />
      <span className="font-medium text-muted-foreground text-sm">{subreddit.name}</span>
    </div>
    {subreddit.count > 0 && (
      <span className="bg-muted text-muted-foreground text-xs font-bold px-2.5 py-1 rounded-full">
        {subreddit.count.toString().padStart(2, '0')}
      </span>
    )}
  </a>
);

// Section Component
const FilterSection: React.FC<{ title: string; items: Subreddit[] }> = ({ title, items }) => (
  <div className="py-4">
    <div className="flex justify-between items-center px-3 mb-2">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-tighter">{title}</h3>
      <a href="#" className="text-sm font-semibold text-muted-foreground hover:text-foreground">All</a>
    </div>
    <div className="space-y-1">
      {items.map(item => <SubredditItem key={item.name + title} subreddit={item} />)}
    </div>
  </div>
);

// Dropdown Component
const FilterDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative px-3 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3 text-left text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
                <span>Filter by</span>
                <svg
                    className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {/* You can add dropdown options here if needed */}
        </div>
    );
};


// --- Main App Component ---
export default function App() {
  return (
    <div className="flex justify-center items-start min-h-full">
      <div className="w-full max-w-xs overflow-hidden">
        <FilterDropdown />
        <div className="px-1">
            <FilterSection title="Favorites" items={favorites} />
            <hr className="border-border mx-3"/>
            <FilterSection title="Reddit Feeds" items={redditFeeds} />
            <hr className="border-border mx-3"/>
            <FilterSection title="Community" items={community} />
        </div>
      </div>
    </div>
  );
}
