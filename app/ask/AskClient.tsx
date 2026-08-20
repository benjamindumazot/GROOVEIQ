"use client";

import { useState } from "react";

export default function AskClient({
  curatedQuestions,
}: {
  curatedQuestions: string[];
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(q: string) {
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setAnswer(data.answer ?? data.error ?? "No answer returned.");
    } catch {
      setAnswer("Something went wrong reaching the AI. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (question.trim()) ask(question.trim());
        }}
        className="flex gap-2"
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about EDM history..."
          className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-zinc-50 text-black px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      <div>
        <h3 className="text-sm font-semibold text-zinc-400 mb-2">
          Curated questions
        </h3>
        <div className="flex flex-wrap gap-2">
          {curatedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              disabled={loading}
              className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-300 hover:border-zinc-400 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {answer && (
        <div className="rounded border border-zinc-800 p-5 whitespace-pre-wrap text-zinc-200">
          {answer}
        </div>
      )}
    </div>
  );
}
