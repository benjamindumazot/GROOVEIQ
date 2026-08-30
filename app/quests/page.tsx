import { getServerClient } from "@/lib/supabase-server";
import Link from "next/link";

export const revalidate = 0;

const DIFFICULTY_STYLE: Record<string, string> = {
  easy:   "text-emerald-400 border-emerald-900 bg-emerald-950/30",
  medium: "text-amber-400 border-amber-900 bg-amber-950/30",
  hard:   "text-red-400 border-red-900 bg-red-950/30",
};

export default async function QuestsPage() {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: quests } = await supabase
    .from("quests")
    .select("id, slug, title, description, difficulty, badge_name, badge_emoji, xp_reward, question_count, scene_slugs")
    .order("order_index");

  // Which quests has the user already completed?
  const completedIds = new Set<string>();
  if (user) {
    const { data: completions } = await supabase
      .from("user_quests")
      .select("quest_id")
      .eq("user_id", user.id);
    completions?.forEach((c: any) => completedIds.add(c.quest_id));
  }

  return (
    <div className="px-6 py-14 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-mono tracking-[0.3em] text-indigo-400 uppercase mb-3">Challenges</p>
        <h1 className="text-4xl font-black tracking-tight">Quests</h1>
        <p className="text-zinc-500 mt-2 text-sm">Multi-scene story arcs. Complete them to earn Specialist badges.</p>
      </div>

      <div className="space-y-4">
        {quests?.map((quest) => {
          const done = completedIds.has(quest.id);
          const scenes: string[] = quest.scene_slugs ?? [];
          return (
            <Link
              key={quest.slug}
              href={`/quests/${quest.slug}`}
              className={`block rounded-2xl border p-6 transition-all group ${
                done
                  ? "border-indigo-900 bg-indigo-950/20 hover:border-indigo-700"
                  : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  <span className="text-3xl shrink-0">{quest.badge_emoji}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="text-lg font-black text-white">{quest.title}</h2>
                      {done && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-indigo-900 bg-indigo-950/50 px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{quest.description}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${DIFFICULTY_STYLE[quest.difficulty]}`}>
                        {quest.difficulty}
                      </span>
                      <span className="text-xs text-zinc-600 font-mono">{quest.question_count} questions</span>
                      <span className="text-xs text-zinc-600 font-mono">Up to {quest.xp_reward + quest.question_count * 35} XP</span>
                    </div>
                    {scenes.length > 0 && (
                      <div className="flex gap-1.5 mt-3 flex-wrap">
                        {scenes.map(s => (
                          <span key={s} className="text-[10px] font-mono text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-md capitalize">
                            {s.replace(/-/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0 mt-1">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      {!user && (
        <p className="text-center text-sm text-zinc-600 mt-8">
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link> to track your completions and earn badges.
        </p>
      )}
    </div>
  );
}
