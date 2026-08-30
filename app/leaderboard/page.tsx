import { getServerClient } from "@/lib/supabase-server";
import Link from "next/link";

export const revalidate = 60;

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function LeaderboardPage() {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Top 50 by XP
  const { data: leaders } = await supabase
    .from("profiles")
    .select("id, display_name, xp, level, streak_count")
    .order("xp", { ascending: false })
    .limit(50);

  // Current user's rank (how many people have strictly more XP)
  let myRank: number | null = null;
  let myProfile: { xp: number; level: number } | null = null;
  if (user) {
    const { data: me } = await supabase
      .from("profiles")
      .select("xp, level")
      .eq("id", user.id)
      .single();
    myProfile = me;
    if (me) {
      const { count } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gt("xp", me.xp);
      myRank = (count ?? 0) + 1;
    }
  }

  const myId = user?.id;
  const myInTop = leaders?.some(l => l.id === myId);

  return (
    <div className="px-6 py-14 max-w-2xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-mono tracking-[0.3em] text-indigo-400 uppercase mb-3">Rankings</p>
        <h1 className="text-4xl font-black tracking-tight">Leaderboard</h1>
        <p className="text-zinc-500 mt-2 text-sm">The most knowledgeable heads in dance music history.</p>
      </div>

      {/* Current user's rank (if not in top 50) */}
      {user && myRank && !myInTop && myProfile && (
        <div className="rounded-xl border border-indigo-900 bg-indigo-950/30 px-4 py-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-600 w-8">#{myRank}</span>
            <span className="text-sm font-bold text-indigo-300">You</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-400">Level <span className="text-white font-bold">{myProfile.level}</span></span>
            <span className="text-indigo-400 font-bold">{myProfile.xp} XP</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-zinc-800 overflow-hidden">
        {leaders?.length === 0 && (
          <p className="text-zinc-600 text-sm p-6 text-center">No players yet — be the first.</p>
        )}
        {leaders?.map((player, i) => {
          const isMe = player.id === myId;
          const rank = i + 1;
          return (
            <div
              key={player.id}
              className={`flex items-center justify-between px-5 py-4 border-b border-zinc-800 last:border-0 transition-colors ${
                isMe ? "bg-indigo-950/20" : "hover:bg-zinc-900/50"
              }`}
            >
              {/* Rank + name */}
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-lg w-8 shrink-0 text-center">
                  {rank <= 3 ? MEDALS[rank - 1] : (
                    <span className="text-xs font-mono text-zinc-600">#{rank}</span>
                  )}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-bold truncate ${isMe ? "text-indigo-300" : "text-white"}`}>
                    {player.display_name ?? "Anonymous"}
                    {isMe && <span className="ml-2 text-xs text-zinc-600 font-normal">you</span>}
                  </p>
                  {(player.streak_count ?? 0) > 1 && (
                    <p className="text-xs text-zinc-600 mt-0.5">🔥 {player.streak_count} day streak</p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-5 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider">Level</p>
                  <p className="text-sm font-bold text-white">{player.level}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider">XP</p>
                  <p className="text-sm font-bold text-indigo-400">{player.xp}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-8 flex gap-3">
        {user ? (
          <Link href="/play" className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-5 py-2.5 transition-all">
            Play today's challenge →
          </Link>
        ) : (
          <Link href="/login" className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-5 py-2.5 transition-all">
            Sign in to compete →
          </Link>
        )}
        <Link href="/scenes" className="rounded-full border border-zinc-800 text-zinc-400 hover:text-white text-sm font-medium px-5 py-2.5 transition-all">
          Explore scenes
        </Link>
      </div>
    </div>
  );
}
