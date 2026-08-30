import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase-server";

const XP_MAP: Record<string, number> = { easy: 10, medium: 20, hard: 35 };

// GET /api/quest?slug=belleville-three  — fetch quest + its questions
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const supabase = await getServerClient();

  const { data: quest } = await supabase
    .from("quests")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!quest) return NextResponse.json({ error: "Quest not found" }, { status: 404 });

  // Fetch scene IDs for the quest's scene slugs
  const sceneSlugs: string[] = quest.scene_slugs ?? [];
  const { data: sceneRows } = await supabase
    .from("scenes")
    .select("id, slug")
    .in("slug", sceneSlugs);

  const sceneIds = (sceneRows ?? []).map((s: any) => s.id);

  // Fetch questions from those scenes
  let query = supabase
    .from("quiz_questions")
    .select("id, question, options, correct_index, explanation, difficulty, scene_id, scenes(name)");

  if (sceneIds.length > 0) {
    query = query.in("scene_id", sceneIds);
  }

  const { data: allQ } = await query;
  const pool = allQ ?? [];

  // Pick quest.question_count questions, distributed across scenes, seeded by quest slug
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;

  const picked: typeof pool = [];
  const used = new Set<number>();
  let n = hash;
  while (picked.length < Math.min(quest.question_count, pool.length)) {
    const idx = n % pool.length;
    if (!used.has(idx)) { used.add(idx); picked.push(pool[idx]); }
    n = (n * 1664525 + 1013904223) >>> 0;
  }

  return NextResponse.json({ quest, questions: picked });
}

// POST /api/quest  — submit completion
export async function POST(req: NextRequest) {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quest_id, answers } = await req.json();

  const score = answers.filter((a: any) => a.chosen_index === a.correct_index).length;
  const xp_from_answers = answers.reduce((sum: number, a: any) => {
    return a.chosen_index === a.correct_index ? sum + (XP_MAP[a.difficulty] ?? 20) : sum;
  }, 0);

  // Fetch quest for bonus XP
  const { data: quest } = await supabase.from("quests").select("xp_reward, badge_name, badge_emoji, question_count").eq("id", quest_id).single();
  const completionBonus = score === (quest?.question_count ?? 0) ? (quest?.xp_reward ?? 0) : Math.floor((quest?.xp_reward ?? 0) * (score / (quest?.question_count ?? 1)));
  const xp_earned = xp_from_answers + completionBonus;

  // Save completion
  const { error } = await supabase.from("user_quests").insert({ user_id: user.id, quest_id, score, xp_earned, answers });
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Quest already completed" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add XP + level
  const { data: profile } = await supabase.from("profiles").select("xp").eq("id", user.id).single();
  const newXp = (profile?.xp ?? 0) + xp_earned;
  const newLevel = Math.floor(newXp / 100) + 1;
  await supabase.from("profiles").update({ xp: newXp, level: newLevel }).eq("id", user.id);

  // Award badge
  const { data: badge } = await supabase.from("badges").select("id").eq("slug", `quest-${quest_id}`).maybeSingle();
  let badgeId = badge?.id;
  if (!badgeId) {
    const { data: newBadge } = await supabase.from("badges").insert({
      slug: `quest-${quest_id}`,
      name: `${quest?.badge_emoji} ${quest?.badge_name}`,
      description: `Completed the "${quest?.badge_name}" quest`,
    }).select("id").single();
    badgeId = newBadge?.id;
  }
  if (badgeId) {
    await supabase.from("user_badges").upsert({ user_id: user.id, badge_id: badgeId }, { onConflict: "user_id,badge_id", ignoreDuplicates: true });
  }

  return NextResponse.json({ score, xp_earned, total_xp: newXp, level: newLevel, badge_name: quest?.badge_name, badge_emoji: quest?.badge_emoji });
}
