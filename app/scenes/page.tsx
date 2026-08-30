import Link from "next/link";
import { getServerClient } from "@/lib/supabase-server";

export const revalidate = 0;

const SCENE_STYLES: Record<string, { gradient: string; accent: string; dot: string }> = {
  "disco-roots":    { gradient: "from-yellow-900/40 via-zinc-900 to-zinc-900", accent: "border-yellow-500/50 hover:border-yellow-400", dot: "bg-yellow-400" },
  "ny-garage":      { gradient: "from-amber-900/40 via-zinc-900 to-zinc-900",  accent: "border-amber-500/50 hover:border-amber-400",  dot: "bg-amber-400" },
  "chicago-house":  { gradient: "from-indigo-900/40 via-zinc-900 to-zinc-900", accent: "border-indigo-500/50 hover:border-indigo-400", dot: "bg-indigo-400" },
  "detroit-techno": { gradient: "from-blue-900/40 via-zinc-900 to-zinc-900",   accent: "border-blue-500/50 hover:border-blue-400",   dot: "bg-blue-400" },
  "berlin-techno":  { gradient: "from-red-900/40 via-zinc-900 to-zinc-900",    accent: "border-red-500/50 hover:border-red-400",    dot: "bg-red-400" },
};
const DEFAULT_STYLE = { gradient: "from-zinc-800/40 via-zinc-900 to-zinc-900", accent: "border-zinc-700 hover:border-zinc-500", dot: "bg-zinc-400" };

type DecayState = "fresh" | "cooling" | "decaying" | "dormant" | "unplayed";

function getDecayState(lastTouched: string | null | undefined): DecayState {
  if (!lastTouched) return "unplayed";
  const days = (Date.now() - new Date(lastTouched).getTime()) / (1000 * 60 * 60 * 24);
  if (days < 2)  return "fresh";
  if (days < 5)  return "cooling";
  if (days < 10) return "decaying";
  return "dormant";
}

const DECAY_OVERLAY: Record<DecayState, string> = {
  unplayed: "",
  fresh:    "",
  cooling:  "opacity-80",
  decaying: "opacity-50 grayscale-[50%]",
  dormant:  "opacity-30 grayscale",
};

const DECAY_LABEL: Record<DecayState, { text: string; color: string } | null> = {
  unplayed: null,
  fresh:    null,
  cooling:  { text: "Cooling down", color: "text-amber-400" },
  decaying: { text: "Records fading", color: "text-red-400" },
  dormant:  { text: "Crate dormant", color: "text-zinc-600" },
};

export default async function ScenesPage() {
  const supabase = await getServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: scenes } = await supabase
    .from("scenes")
    .select("slug, name, city, era_start, era_end, anchor_venue, key_figures, overview")
    .order("order_index");

  // Load user progress if logged in
  const progressMap: Record<string, string | null> = {};
  if (user) {
    const { data: progress } = await supabase
      .from("user_progress")
      .select("scene_id, last_touched_at")
      .eq("user_id", user.id);

    // Map scene_id → last_touched_at
    const sceneIds = scenes?.map(s => s.slug) ?? [];
    // Need scene slugs → ids for mapping; fetch them
    const { data: sceneRows } = await supabase
      .from("scenes")
      .select("id, slug");

    const idToSlug: Record<string, string> = {};
    sceneRows?.forEach((r: any) => { idToSlug[r.id] = r.slug; });

    progress?.forEach((p: any) => {
      const slug = idToSlug[p.scene_id];
      if (slug) progressMap[slug] = p.last_touched_at;
    });
  }

  return (
    <div className="px-6 py-14 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-mono tracking-[0.3em] text-indigo-400 uppercase mb-3">Origins</p>
        <h1 className="text-4xl font-black tracking-tight">Scenes</h1>
        <p className="text-zinc-500 mt-2 text-sm">The cities, clubs, and moments that built electronic music.</p>
      </div>

      {user && (
        <p className="text-xs text-zinc-600 mb-6 font-mono">
          Scenes fade when you haven't visited them — play daily challenges to keep your crates fresh.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {scenes?.map((scene) => {
          const style = SCENE_STYLES[scene.slug] ?? DEFAULT_STYLE;
          const decay = user ? getDecayState(progressMap[scene.slug]) : "unplayed";
          const overlay = DECAY_OVERLAY[decay];
          const decayLabel = DECAY_LABEL[decay];

          return (
            <Link
              key={scene.slug}
              href={`/scenes/${scene.slug}`}
              className={`block rounded-2xl border bg-gradient-to-br ${style.gradient} ${style.accent} p-6 transition-all group ${overlay}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${style.dot} ${decay === "fresh" || decay === "unplayed" ? "animate-pulse-glow" : ""}`} />
                  <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
                    {scene.city} · {scene.era_start}–{scene.era_end ?? "present"}
                  </span>
                </div>
                {decayLabel && (
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${decayLabel.color}`}>
                    {decayLabel.text}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white mb-2 group-hover:text-zinc-100 transition-colors">
                {scene.name}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-2">
                {(scene as any).overview ?? scene.anchor_venue}
              </p>
              <p className="text-xs text-zinc-600 font-mono">{scene.key_figures}</p>

              {/* Decay progress bar */}
              {user && decay !== "unplayed" && (
                <div className="mt-4 h-0.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      decay === "fresh"    ? "bg-emerald-500 w-full" :
                      decay === "cooling"  ? "bg-amber-500 w-2/3" :
                      decay === "decaying" ? "bg-red-600 w-1/4" :
                      "bg-zinc-700 w-0"
                    }`}
                  />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
