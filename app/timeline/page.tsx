import { getServiceClient } from "@/lib/supabase";

export const revalidate = 0;

const CATEGORY_COLORS: Record<string, string> = {
  synth:         "bg-indigo-500 text-white",
  "drum machine": "bg-red-500 text-white",
  DAW:           "bg-emerald-500 text-white",
  sampler:       "bg-amber-500 text-black",
  mixer:         "bg-blue-500 text-white",
  controller:    "bg-violet-500 text-white",
};
const DEFAULT_COLOR = "bg-zinc-700 text-white";

export default async function TimelinePage({
  searchParams,
}: {
  searchParams: Promise<{ scene?: string }>;
}) {
  const { scene: sceneFilter } = await searchParams;
  const supabase = getServiceClient();

  const { data: scenes } = await supabase
    .from("scenes")
    .select("slug, name")
    .order("order_index");

  let gearQuery = supabase
    .from("gear_scenes")
    .select("gear(slug, name, category, release_year, description), scenes(slug, name)");

  if (sceneFilter) {
    const { data: scene } = await supabase
      .from("scenes")
      .select("id")
      .eq("slug", sceneFilter)
      .single();
    if (scene) gearQuery = gearQuery.eq("scene_id", scene.id);
  }

  const { data: links } = await gearQuery;

  const seen = new Set<string>();
  const items = (links ?? [])
    .filter((l: any) => {
      const slug = l.gear?.slug;
      if (!slug || seen.has(slug)) return false;
      seen.add(slug);
      return true;
    })
    .sort((a: any, b: any) => a.gear.release_year - b.gear.release_year);

  return (
    <div className="px-6 py-14 max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-mono tracking-[0.3em] text-indigo-400 uppercase mb-3">History</p>
        <h1 className="text-4xl font-black tracking-tight">Timeline</h1>
        <p className="text-zinc-500 mt-2 text-sm">The machines that made the music.</p>
      </div>

      <div className="flex gap-2 mb-10 flex-wrap">
        <a
          href="/timeline"
          className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${
            !sceneFilter
              ? "bg-white text-black border-white"
              : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
          }`}
        >
          All
        </a>
        {scenes?.map((s) => (
          <a
            key={s.slug}
            href={`/timeline?scene=${s.slug}`}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${
              sceneFilter === s.slug
                ? "bg-white text-black border-white"
                : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
            }`}
          >
            {s.name}
          </a>
        ))}
      </div>

      <ol className="relative border-l-2 border-zinc-800 ml-2">
        {items.map((item: any, i: number) => {
          const colorClass = CATEGORY_COLORS[item.gear.category?.toLowerCase()] ?? DEFAULT_COLOR;
          return (
            <li key={i} className="ml-8 mb-10 relative">
              <span className="absolute -left-[41px] flex h-4 w-4 rounded-full border-2 border-zinc-800 bg-black items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
              </span>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono text-zinc-600">{item.gear.release_year}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colorClass}`}>
                  {item.gear.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{item.gear.name}</h3>
              {item.gear.description && (
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{item.gear.description}</p>
              )}
            </li>
          );
        })}
        {!items.length && (
          <p className="text-zinc-600 text-sm ml-8">No gear for this filter yet.</p>
        )}
      </ol>
    </div>
  );
}
