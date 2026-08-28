import AskClient from "./AskClient";

const CURATED_QUESTIONS = [
  "Why did Frankie Knuckles leave New York?",
  "How did the Berlin Wall create Tresor?",
  "What made Strings of Life transcend genres?",
  "Who is Larry Levan and why does Paradise Garage still matter?",
  "How did the TB-303 accidentally create acid house?",
  "What's the real difference between Chicago house and Detroit techno?",
  "Why was the Music Institute so important to Detroit techno?",
  "How did disco's collapse lead to garage and house?",
  "What did Ron Hardy do differently from Frankie Knuckles?",
  "Why does Berghain still matter in 2026?",
];

export default function AskPage() {
  return (
    <div className="px-6 py-14 max-w-2xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-mono tracking-[0.3em] text-indigo-400 uppercase mb-3">Knowledge</p>
        <h1 className="text-4xl font-black tracking-tight">Ask</h1>
        <p className="text-zinc-500 mt-2 text-sm">Ask anything about the history, culture, and sound of electronic music.</p>
      </div>
      <AskClient curatedQuestions={CURATED_QUESTIONS} />
    </div>
  );
}
