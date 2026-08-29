import { getServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function PlayPage() {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const displayName = user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "Player";

  return (
    <div className="px-6 py-14 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-mono tracking-[0.3em] text-indigo-400 uppercase mb-3">Welcome back</p>
        <h1 className="text-4xl font-black tracking-tight">Hey, {displayName}</h1>
        <p className="text-zinc-500 mt-2 text-sm">Your knowledge of dance music history, put to the test.</p>
      </div>

      {/* Coming soon cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-6">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-2">Coming soon</p>
          <h2 className="text-xl font-black text-white mb-1">Daily Challenge</h2>
          <p className="text-sm text-zinc-500">5 questions. One scene. New every day.</p>
        </div>
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-6">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-2">Coming soon</p>
          <h2 className="text-xl font-black text-white mb-1">Quests</h2>
          <p className="text-sm text-zinc-500">Multi-scene story arcs. Earn Specialist badges.</p>
        </div>
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-6">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-2">Coming soon</p>
          <h2 className="text-xl font-black text-white mb-1">Leaderboard</h2>
          <p className="text-sm text-zinc-500">Global ranking + per-scene specialists.</p>
        </div>
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30 p-6">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-2">Coming soon</p>
          <h2 className="text-xl font-black text-white mb-1">Your Profile</h2>
          <p className="text-sm text-zinc-500">Badges, XP, streak — your record.</p>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-zinc-900">
        <p className="text-sm text-zinc-600 mb-4">While we build the game, explore the history:</p>
        <div className="flex gap-3 flex-wrap">
          {["/scenes", "/timeline", "/labels", "/ask"].map(href => (
            <Link key={href} href={href} className="rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-all capitalize">
              {href.slice(1)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
