import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-57px)] flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl animate-fade-up">
        <p className="text-xs font-mono tracking-[0.3em] text-indigo-400 uppercase mb-6">
          The culture behind the music
        </p>
        <h1 className="text-6xl sm:text-7xl font-black tracking-tighter leading-none mb-6">
          Groove<span className="text-indigo-400">IQ</span>
        </h1>
        <p className="text-lg text-zinc-400 mb-10 leading-relaxed max-w-lg mx-auto">
          Explore the scenes, labels, artists, and machines that built electronic music — from the Warehouse to Berghain.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-16">
          <Link
            href="/scenes"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full transition-colors text-sm"
          >
            Explore Scenes
          </Link>
          <Link
            href="/ask"
            className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold rounded-full transition-colors text-sm"
          >
            Ask Anything
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          {[
            { label: "NY Garage", sub: "1977–1987", color: "from-amber-600/20 to-transparent", accent: "bg-amber-400" },
            { label: "Chicago House", sub: "1983–1990", color: "from-indigo-600/20 to-transparent", accent: "bg-indigo-400" },
            { label: "Detroit Techno", sub: "1985–1993", color: "from-blue-600/20 to-transparent", accent: "bg-blue-400" },
            { label: "Berlin Techno", sub: "1989–now", color: "from-red-600/20 to-transparent", accent: "bg-red-400" },
          ].map((scene) => (
            <Link
              key={scene.label}
              href="/scenes"
              className={`rounded-xl border border-zinc-800 p-4 bg-gradient-to-br ${scene.color} hover:border-zinc-600 transition-all group`}
            >
              <span className={`inline-block w-2 h-2 rounded-full ${scene.accent} mb-2`} />
              <p className="text-sm font-semibold text-white">{scene.label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{scene.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
