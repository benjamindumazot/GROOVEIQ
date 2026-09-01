import { getServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DailyChallenge from "./DailyChallenge";

const MEDALS = ["🥇", "🥈", "🥉"];

export const revalidate = 0;

// Pick 5 questions deterministically by UTC date so everyone gets the same set
function dailySeed(total: number): number[] {
  const today = new Date().toISOString().slice(0, 10); // "2026-08-29"
  let hash = 0;
  for (let i = 0; i < today.length; i++) hash = (hash * 31 + today.charCodeAt(i)) >>> 0;

  const indices = new Set<number>();
  let n = hash;
  while (indices.size < Math.min(5, total)) {
    indices.add(n % total);
    n = (n * 1664525 + 1013904223) >>> 0;
  }
  return Array.from(indices);
}

export default async function PlayPage() {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const displayName = user.user_metadata?.display_name ?? user.email?.split("@")[0] ?? "Player";

  // Fetch profile (XP, level, streak)
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, level, streak_count")
    .eq("id", user.id)
    .single();

  // Check if already played today
  const today = new Date().toISOString().slice(0, 10);
  const { data: attempt } = await supabase
    .from("challenge_attempts")
    .select("score")
    .eq("user_id", user.id)
    .eq("challenge_date", today)
    .maybeSingle();

  // Top 5 leaderboard preview
  const { data: topPlayers } = await supabase
    .from("profiles")
    .select("id, display_name, xp, level")
    .order("xp", { ascending: false })
    .limit(5);

  // Fetch all questions + pick today's 5
  const { data: allQuestions } = await supabase
    .from("quiz_questions")
    .select("id, question, options, correct_index, explanation, difficulty, scenes(name)");

  const questions = allQuestions ?? [];
  const picks = dailySeed(questions.length);
  const todaysQuestions = picks.map(i => questions[i]).filter(Boolean);

  return (
    <div className="px-6 py-14 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono tracking-[0.3em] text-indigo-400 uppercase mb-3">Game Mode</p>
        <h1 className="text-4xl font-black tracking-tight">Hey, {displayName}</h1>
        <div className="flex items-center gap-4 mt-3">
          <span className="text-sm text-zinc-400">
            Level <span className="text-white font-bold">{profile?.level ?? 1}</span>
          </span>
          <span className="text-zinc-800">·</span>
          <span className="text-sm text-zinc-400">
            <span className="text-indigo-400 font-bold">{profile?.xp ?? 0}</span> XP
          </span>
          {(profile?.streak_count ?? 0) > 0 && (
            <>
              <span className="text-zinc-800">·</span>
              <span className="text-sm text-zinc-400">
                🔥 <span className="text-white font-bold">{profile?.streak_count}</span> day streak
              </span>
            </>
          )}
        </div>
      </div>

      {/* XP progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-mono text-zinc-600 mb-1.5">
          <span>Level {profile?.level ?? 1}</span>
          <span>{(profile?.xp ?? 0) % 100}/100 XP to next level</span>
        </div>
        <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all"
            style={{ width: `${(profile?.xp ?? 0) % 100}%` }}
          />
        </div>
      </div>

      {/* Daily Challenge */}
      {todaysQuestions.length > 0 ? (
        <DailyChallenge
          questions={todaysQuestions}
          alreadyPlayed={!!attempt}
          lastScore={attempt?.score ?? null}
        />
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center text-zinc-500 text-sm">
          No questions loaded yet — run the seed SQL in Supabase.
        </div>
      )}

      {/* Leaderboard preview */}
      {(topPlayers?.length ?? 0) > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider">Top players</p>
            <Link href="/leaderboard" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Full rankings →
            </Link>
          </div>
          <div className="rounded-2xl border border-zinc-800 overflow-hidden">
            {topPlayers!.map((player, i) => {
              const isMe = player.id === user.id;
              return (
                <div key={player.id} className={`flex items-center justify-between px-4 py-3 border-b border-zinc-800 last:border-0 ${isMe ? "bg-indigo-950/20" : ""}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-base w-6 text-center">{i < 3 ? MEDALS[i] : <span className="text-xs font-mono text-zinc-600">#{i + 1}</span>}</span>
                    <span className={`text-sm font-semibold ${isMe ? "text-indigo-300" : "text-white"}`}>
                      {player.display_name ?? "Anonymous"}{isMe && <span className="ml-1.5 text-xs text-zinc-600 font-normal">you</span>}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-indigo-400">{player.xp} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quests teaser */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider">Quests</p>
          <Link href="/quests" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">All quests →</Link>
        </div>
        <Link href="/quests/origin-story" className="block rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 p-4 transition-all group">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-zinc-100">The Origin Story</p>
              <p className="text-xs text-zinc-500 mt-0.5">From The Loft to The Warehouse — 6 questions, 3 scenes</p>
            </div>
            <span className="ml-auto text-zinc-600 group-hover:text-zinc-400 transition-colors">→</span>
          </div>
        </Link>
      </div>

      <div className="mt-6 pt-5 border-t border-zinc-900">
        <p className="text-xs text-zinc-600 mb-3">Explore the history between challenges:</p>
        <div className="flex gap-2 flex-wrap">
          {["/scenes", "/timeline", "/labels", "/ask"].map(href => (
            <Link key={href} href={href} className="rounded-full border border-zinc-800 px-3 py-1.5 text-xs text-zinc-500 hover:text-white hover:border-zinc-600 transition-all capitalize">
              {href.slice(1)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
