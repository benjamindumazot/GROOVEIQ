import Link from "next/link";
import { getServiceClient } from "@/lib/supabase";

export const revalidate = 0;

const SCENE_STYLES: Record<string, { gradient: string; accent: string; dot: string }> = {
  "disco-roots":    { gradient: "from-yellow-900/40 via-zinc-900 to-zinc-900", accent: "border-yellow-500/50 hover:border-yellow-400", dot: "bg-yellow-400" },
  "ny-garage":      { gradient: "from-amber-900/40 via-zinc-900 to-zinc-900",  accent: "border-amber-500/50 hover:border-amber-400", dot: "bg-amber-400" },
  "chicago-house":  { gradient: "from-indigo-900/40 via-zinc-900 to-zinc-900", accent: "border-indigo-500/50 hover:border-indigo-400", dot: "bg-indigo-400" },
  "detroit-techno": { gradient: "from-blue-900/40 via-zinc-900 to-zinc-900",   accent: "border-blue-500/50 hover:border-blue-400", dot: "bg-blue-400" },
  "berlin-techno":  { gradient: "from-red-900/40 via-zinc-900 to-zinc-900",    accent: "border-red-500/50 hover:border-red-400", dot: "bg-red-400" },
};

const DEFAULT_STYLE = { gradient: "from-zinc-800/40 via-zinc-900 to-zinc-900", accent: "border-zinc-700 hover:border-zinc-500", dot: "bg-zinc-400" };

export default async function ScenesPage() {
  const supabase = getServiceClient();
  const { data: scenes } = await supabase
    .from("scenes")
    .select("slug, name, city, era_start, era_end, anchor_venue, key_figures, overview")
    .order("order_index");

  return (
    <div className="px-6 py-14 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-mono tracking-[0.3em] text-indigo-400 uppercase mb-3">Origins</p>
        <h1 className="text-4xl font-black tracking-tight">Scenes</h1>
        <p className="text-zinc-500 mt-2 text-sm">The cities, clubs, and moments that built electronic music.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {scenes?.map((scene) => {
          const style = SCENE_STYLES[scene.slug] ?? DEFAULT_STYLE;
          return (
            <Link
              key={scene.slug}
              href={`/scenes/${scene.slug}`}
              className={`block rounded-2xl border bg-gradient-to-br ${style.gradient} ${style.accent} p-6 transition-all group`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2.5 h-2.5 rounded-full ${style.dot} animate-pulse-glow`} />
                <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
                  {scene.city} · {scene.era_start}–{scene.era_end ?? "present"}
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white mb-2 group-hover:text-zinc-100 transition-colors">
                {scene.name}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                {(scene as any).overview ?? scene.anchor_venue}
              </p>
              <p className="text-xs text-zinc-600 font-mono">{scene.key_figures}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
