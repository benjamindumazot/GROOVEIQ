import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrooveIQ",
  description: "Learn the culture behind the music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-zinc-50">
        <header className="border-b border-zinc-800 px-6 py-4 flex items-center gap-8">
          <Link href="/" className="font-bold tracking-tight text-lg">
            GrooveIQ
          </Link>
          <nav className="flex gap-6 text-sm font-medium text-zinc-400">
            <Link href="/timeline" className="hover:text-zinc-50">
              Timeline
            </Link>
            <Link href="/scenes" className="hover:text-zinc-50">
              Scenes
            </Link>
            <Link href="/labels" className="hover:text-zinc-50">
              Labels
            </Link>
            <Link href="/ask" className="hover:text-zinc-50">
              Ask
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
