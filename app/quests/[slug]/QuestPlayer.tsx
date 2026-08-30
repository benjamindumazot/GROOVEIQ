"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Question = {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  difficulty: string;
  scenes?: { name: string } | null;
};

type Quest = {
  id: string;
  title: string;
  badge_name: string;
  badge_emoji: string;
  question_count: number;
  xp_reward: number;
};

type Result = {
  score: number;
  xp_earned: number;
  total_xp: number;
  level: number;
  badge_name: string;
  badge_emoji: string;
};

export default function QuestPlayer({ slug, alreadyCompleted }: { slug: string; alreadyCompleted: boolean }) {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/quest?slug=${slug}`)
      .then(r => r.json())
      .then(data => { setQuest(data.quest); setQuestions(data.questions); setLoading(false); });
  }, [slug]);

  if (loading) return (
    <div className="flex items-center gap-3 text-zinc-500 text-sm py-10">
      <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-pulse-glow" />
      Loading quest…
    </div>
  );

  if (alreadyCompleted && !result) return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center">
      <div className="text-4xl mb-3">{quest?.badge_emoji}</div>
      <h2 className="text-xl font-black mb-2">Quest complete</h2>
      <p className="text-zinc-400 text-sm mb-1">You've already earned the <span className="text-white font-bold">{quest?.badge_name}</span> badge.</p>
      <p className="text-zinc-600 text-xs mb-6">More quests coming soon.</p>
      <Link href="/quests" className="rounded-full border border-zinc-700 text-zinc-300 hover:text-white px-5 py-2 text-sm transition-all">
        Back to quests
      </Link>
    </div>
  );

  if (result) {
    const pct = Math.round((result.score / (quest?.question_count ?? 1)) * 100);
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center animate-fade-up">
        <div className="text-6xl mb-4">{result.badge_emoji}</div>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Quest complete</p>
        <h2 className="text-3xl font-black mb-1">{result.score}/{quest?.question_count} correct</h2>
        <p className="text-zinc-400 text-sm mb-5">
          {pct === 100 ? "Perfect. The culture runs deep in you." : pct >= 60 ? "Solid. Keep digging." : "The history is long. Keep exploring."}
        </p>
        <div className="inline-flex flex-col items-center gap-1 bg-indigo-950/60 border border-indigo-900 rounded-2xl px-6 py-4 mb-6">
          <span className="text-indigo-300 text-xs font-mono uppercase tracking-wider">Badge earned</span>
          <span className="text-white font-black text-lg">{result.badge_emoji} {result.badge_name}</span>
          <span className="text-indigo-400 font-bold text-sm mt-1">+{result.xp_earned} XP</span>
          <span className="text-zinc-600 text-xs">Level {result.level} · {result.total_xp} total XP</span>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/quests" className="rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 text-sm transition-all">
            More quests →
          </Link>
          <Link href="/leaderboard" className="rounded-full border border-zinc-700 text-zinc-300 hover:text-white px-5 py-2.5 text-sm transition-all">
            See rankings
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[current];
  if (!q) return null;
  const isLast = current === questions.length - 1;
  const answered = chosen !== null;

  function choose(idx: number) {
    if (answered) return;
    setChosen(idx);
  }

  async function next() {
    if (chosen === null || !quest) return;
    const newAnswers = [...answers, { question_id: q.id, chosen_index: chosen, correct_index: q.correct_index, difficulty: q.difficulty }];

    if (isLast) {
      setSubmitting(true);
      const res = await fetch("/api/quest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quest_id: quest.id, answers: newAnswers }),
      });
      const data = await res.json();
      setResult(data);
      setSubmitting(false);
    } else {
      setAnswers(newAnswers);
      setChosen(null);
      setCurrent(c => c + 1);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider">Quest</p>
          {q.scenes?.name && <p className="text-xs text-indigo-400 font-mono mt-0.5">{q.scenes.name}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-600">{current + 1}/{questions.length}</span>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
            q.difficulty === "hard"   ? "bg-red-950/50 text-red-400 border border-red-900" :
            q.difficulty === "easy"   ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900" :
                                        "bg-amber-950/50 text-amber-400 border border-amber-900"
          }`}>{q.difficulty}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {questions.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
            i < current ? "bg-indigo-500" : i === current ? "bg-indigo-700" : "bg-zinc-800"
          }`} />
        ))}
      </div>

      <h3 className="text-lg font-bold text-white mb-5 leading-snug">{q.question}</h3>

      <div className="space-y-2 mb-6">
        {q.options.map((opt, idx) => {
          const isChosen = chosen === idx;
          const isCorrect = idx === q.correct_index;
          let cls = "w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ";
          if (!answered) cls += "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-indigo-500 hover:text-white hover:bg-indigo-950/20 cursor-pointer";
          else if (isCorrect) cls += "border-emerald-600 bg-emerald-950/30 text-emerald-300";
          else if (isChosen) cls += "border-red-700 bg-red-950/30 text-red-300";
          else cls += "border-zinc-800 bg-zinc-900/50 text-zinc-600";
          return (
            <button key={idx} className={cls} onClick={() => choose(idx)} disabled={answered}>
              <span className="font-mono text-xs mr-3 opacity-50">{String.fromCharCode(65 + idx)}</span>
              {opt}
              {answered && isCorrect && <span className="ml-2">✓</span>}
              {answered && isChosen && !isCorrect && <span className="ml-2">✗</span>}
            </button>
          );
        })}
      </div>

      {answered && q.explanation && (
        <div className="rounded-xl bg-zinc-800/60 border border-zinc-700 px-4 py-3 text-sm text-zinc-300 leading-relaxed mb-5 animate-fade-up">
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider block mb-1">The story</span>
          {q.explanation}
        </div>
      )}

      {answered && (
        <button onClick={next} disabled={submitting} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold py-3 text-sm transition-all animate-fade-up">
          {submitting ? "Saving…" : isLast ? "Claim badge →" : "Next question →"}
        </button>
      )}
    </div>
  );
}
