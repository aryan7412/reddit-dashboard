import type { Metadata } from "next";
import { Reddit_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers"

const redditSans = Reddit_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reddit",
  description: "A Reddit-style community platform and discussion forum built with Next.js. Join communities, share content, and vote on posts.",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${redditSans.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
