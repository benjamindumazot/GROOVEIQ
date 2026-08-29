import { NextRequest, NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabase-server";

// XP per correct answer, scaled by difficulty
const XP_MAP: Record<string, number> = { easy: 10, medium: 20, hard: 35 };

export async function POST(req: NextRequest) {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { answers } = await req.json();
  // answers: [{question_id, chosen_index, correct_index, difficulty}]

  const score = answers.filter((a: any) => a.chosen_index === a.correct_index).length;
  const xp_earned = answers.reduce((sum: number, a: any) => {
    return a.chosen_index === a.correct_index
      ? sum + (XP_MAP[a.difficulty] ?? 20)
      : sum;
  }, 0);

  // Save attempt (unique per user per day)
  const { error: attemptError } = await supabase
    .from("challenge_attempts")
    .insert({ user_id: user.id, score, xp_earned, answers });

  if (attemptError) {
    if (attemptError.code === "23505") {
      return NextResponse.json({ error: "Already played today" }, { status: 409 });
    }
    return NextResponse.json({ error: attemptError.message }, { status: 500 });
  }

  // Add XP to profile and recalculate level (100 XP per level)
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", user.id)
    .single();

  const newXp = (profile?.xp ?? 0) + xp_earned;
  const newLevel = Math.floor(newXp / 100) + 1;

  await supabase
    .from("profiles")
    .update({ xp: newXp, level: newLevel })
    .eq("id", user.id);

  return NextResponse.json({ score, xp_earned, total_xp: newXp, level: newLevel });
}
