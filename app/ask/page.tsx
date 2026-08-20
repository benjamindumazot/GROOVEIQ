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
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Ask</h1>
      <p className="text-zinc-400 text-sm mb-6">
        Curated deep questions, or ask your own.
      </p>
      <AskClient curatedQuestions={CURATED_QUESTIONS} />
    </div>
  );
}
