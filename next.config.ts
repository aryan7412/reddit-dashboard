import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow remote images used by NextAuth/User avatars
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
