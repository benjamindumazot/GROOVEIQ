import { getServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import QuestPlayer from "./QuestPlayer";

export const revalidate = 0;

export default async function QuestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quest } = await supabase
    .from("quests")
    .select("id, title, description, difficulty, badge_name, badge_emoji, xp_reward, question_count, scene_slugs")
    .eq("slug", slug)
    .single();

  if (!quest) redirect("/quests");

  const { data: completion } = await supabase
    .from("user_quests")
    .select("score, xp_earned")
    .eq("user_id", user.id)
    .eq("quest_id", quest.id)
    .maybeSingle();

  const difficultyColor = quest.difficulty === "hard" ? "text-red-400 border-red-900 bg-red-950/30"
    : quest.difficulty === "easy" ? "text-emerald-400 border-emerald-900 bg-emerald-950/30"
    : "text-amber-400 border-amber-900 bg-amber-950/30";

  return (
    <div className="px-6 py-14 max-w-2xl mx-auto">
      <div className="mb-2">
        <Link href="/quests" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors font-mono">
          ← All quests
        </Link>
      </div>
      <div className="mb-8 mt-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{quest.badge_emoji}</span>
          <span className={`text-[11px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${difficultyColor}`}>
            {quest.difficulty}
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2">{quest.title}</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-4">{quest.description}</p>
        <div className="flex gap-4 text-xs font-mono text-zinc-600">
          <span>{quest.question_count} questions</span>
          <span>·</span>
          <span>Up to {quest.xp_reward + quest.question_count * 35} XP</span>
          <span>·</span>
          <span>Badge: {quest.badge_emoji} {quest.badge_name}</span>
        </div>
      </div>

      <QuestPlayer slug={slug} alreadyCompleted={!!completion} />
    </div>
  );
}
