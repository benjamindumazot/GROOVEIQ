"use client";

import { useState } from "react";

type Question = {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  difficulty: string;
  scenes?: { name: string }[] | { name: string } | null;
};

type Props = {
  questions: Question[];
  alreadyPlayed: boolean;
  lastScore?: number | null;
};

type AnswerState = {
  question_id: string;
  chosen_index: number;
  correct_index: number;
  difficulty: string;
};

export default function DailyChallenge({ questions, alreadyPlayed, lastScore }: Props) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; xp_earned: number; total_xp: number; level: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const answered = chosen !== null;

  function choose(idx: number) {
    if (answered) return;
    setChosen(idx);
  }

  async function next() {
    if (chosen === null) return;
    const newAnswers = [...answers, { chosen_index: chosen, correct_index: q.correct_index, difficulty: q.difficulty, question_id: q.id }];

    if (isLast) {
      setSubmitting(true);
      const res = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: newAnswers }),
      });
      const data = await res.json();
      setResult(data);
      setSubmitted(true);
      setSubmitting(false);
    } else {
      setAnswers(newAnswers);
      setChosen(null);
      setCurrent(c => c + 1);
    }
  }

  if (alreadyPlayed && !submitted) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider mb-2">Daily Challenge</p>
        <h2 className="text-xl font-black mb-1">Already played today</h2>
        <p className="text-zinc-400 text-sm">
          You scored <span className="text-white font-bold">{lastScore}/{questions.length}</span> today. Come back tomorrow for a new challenge.
        </p>
        <div className="mt-4 flex gap-1">
          {Array.from({ length: questions.length }).map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i < (lastScore ?? 0) ? "bg-indigo-500" : "bg-zinc-800"}`} />
          ))}
        </div>
      </div>
    );
  }

  if (submitted && result) {
    const pct = Math.round((result.score / questions.length) * 100);
    const medal = result.score === questions.length ? "🏆" : result.score >= 3 ? "⭐" : "🎵";
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center animate-fade-up">
        <div className="text-5xl mb-4">{medal}</div>
        <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Challenge complete</p>
        <h2 className="text-3xl font-black mb-1">{result.score}/{questions.length} correct</h2>
        <p className="text-zinc-400 text-sm mb-6">
          {pct === 100 ? "Perfect score — you're a genuine head." : pct >= 60 ? "Solid knowledge. Keep digging." : "The culture goes deep. Keep exploring."}
        </p>
        <div className="inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-900 rounded-full px-5 py-2.5 mb-6">
          <span className="text-indigo-400 font-black text-lg">+{result.xp_earned} XP</span>
          <span className="text-zinc-600 text-sm">· Level {result.level}</span>
        </div>
        <div className="flex gap-1 mb-6">
          {Array.from({ length: questions.length }).map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i < result.score ? "bg-indigo-500" : "bg-zinc-800"}`} />
          ))}
        </div>
        <p className="text-xs text-zinc-600">New challenge drops tomorrow.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-wider">Daily Challenge</p>
          {q.scenes && (
            <p className="text-xs text-indigo-400 font-mono mt-0.5">
              {Array.isArray(q.scenes) ? q.scenes[0]?.name : (q.scenes as any)?.name}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-600">{current + 1}/{questions.length}</span>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
            q.difficulty === "hard" ? "bg-red-950/50 text-red-400 border border-red-900" :
            q.difficulty === "easy" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900" :
            "bg-amber-950/50 text-amber-400 border border-amber-900"
          }`}>{q.difficulty}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {questions.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
            i < current ? "bg-indigo-500" : i === current ? "bg-indigo-700" : "bg-zinc-800"
          }`} />
        ))}
      </div>

      {/* Question */}
      <h3 className="text-lg font-bold text-white mb-5 leading-snug">{q.question}</h3>

      {/* Options */}
      <div className="space-y-2 mb-6">
        {q.options.map((opt, idx) => {
          const isChosen = chosen === idx;
          const isCorrect = idx === q.correct_index;
          let cls = "w-full text-left rounded-xl border px-4 py-3 text-sm transition-all ";
          if (!answered) {
            cls += "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-indigo-500 hover:text-white hover:bg-indigo-950/20 cursor-pointer";
          } else if (isCorrect) {
            cls += "border-emerald-600 bg-emerald-950/30 text-emerald-300";
          } else if (isChosen && !isCorrect) {
            cls += "border-red-700 bg-red-950/30 text-red-300";
          } else {
            cls += "border-zinc-800 bg-zinc-900/50 text-zinc-600";
          }
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

      {/* Explanation (after answering) */}
      {answered && q.explanation && (
        <div className="rounded-xl bg-zinc-800/60 border border-zinc-700 px-4 py-3 text-sm text-zinc-300 leading-relaxed mb-5 animate-fade-up">
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider block mb-1">The story</span>
          {q.explanation}
        </div>
      )}

      {/* Next / Submit */}
      {answered && (
        <button
          onClick={next}
          disabled={submitting}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white font-bold py-3 text-sm transition-all animate-fade-up"
        >
          {submitting ? "Saving…" : isLast ? "See results" : "Next question →"}
        </button>
      )}
    </div>
  );
}
