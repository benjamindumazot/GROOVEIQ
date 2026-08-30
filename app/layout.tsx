import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { getServerClient } from "@/lib/supabase-server";
import NavAuth from "./NavAuth";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-zinc-50">
        <header className="border-b border-zinc-900 px-6 py-4 flex items-center gap-6 sticky top-0 z-50 bg-black/80 backdrop-blur-md">
          <Link href="/" className="font-black tracking-tighter text-xl text-white hover:text-zinc-300 transition-colors shrink-0">
            Groove<span className="text-indigo-400">IQ</span>
          </Link>
          <nav className="flex gap-1 text-sm font-medium flex-1">
            <Link href="/play" className="px-3 py-1.5 rounded-md text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/40 font-bold transition-all">Play</Link>
            {[
              { href: "/scenes", label: "Scenes" },
              { href: "/timeline", label: "Timeline" },
              { href: "/labels", label: "Labels" },
              { href: "/leaderboard", label: "Rankings" },
              { href: "/ask", label: "Ask" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
              >
                {label}
              </Link>
            ))}
          </nav>
          <NavAuth user={user} />
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
