"use client";

import { useState } from "react";

export default function AskClient({ curatedQuestions }: { curatedQuestions: string[] }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState("");

  async function ask(q: string) {
    setLoading(true);
    setAnswer("");
    setAsked(q);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setAnswer(data.answer ?? data.error ?? "No answer returned.");
    } catch {
      setAnswer("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (question.trim()) ask(question.trim());
        }}
        className="relative"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about electronic music history…"
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 pr-24 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-semibold transition-all"
        >
          {loading ? "…" : "Ask"}
        </button>
      </form>

      {/* Curated questions */}
      <div>
        <p className="text-[11px] font-mono tracking-[0.2em] text-zinc-600 uppercase mb-3">Start here</p>
        <div className="flex flex-wrap gap-2">
          {curatedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => { setQuestion(q); ask(q); }}
              disabled={loading}
              className="rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-950/30 transition-all disabled:opacity-40 text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Answer */}
      {(loading || answer) && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 animate-fade-up">
          {asked && (
            <p className="text-xs font-mono text-zinc-600 mb-4 pb-4 border-b border-zinc-800">
              Q: {asked}
            </p>
          )}
          {loading ? (
            <div className="flex items-center gap-3 text-zinc-500 text-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-pulse-glow" />
              Thinking…
            </div>
          ) : (
            <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap text-sm">{answer}</p>
          )}
        </div>
      )}
    </div>
  );
}
