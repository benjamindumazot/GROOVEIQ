import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function TimelinePage({
  searchParams,
}: {
  searchParams: Promise<{ scene?: string }>;
}) {
  const { scene: sceneFilter } = await searchParams;

  const { data: scenes } = await supabase
    .from("scenes")
    .select("slug, name")
    .order("order_index");

  let gearQuery = supabase
    .from("gear_scenes")
    .select("gear(slug, name, category, release_year), scenes(slug, name)");

  if (sceneFilter) {
    const { data: scene } = await supabase
      .from("scenes")
      .select("id")
      .eq("slug", sceneFilter)
      .single();
    if (scene) gearQuery = gearQuery.eq("scene_id", scene.id);
  }

  const { data: links } = await gearQuery;

  // Dedupe by gear slug since one gear item can link to multiple scenes.
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
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Timeline</h1>
      <p className="text-zinc-400 text-sm mb-6">
        Gear and technology that defined each era, 1968 to present.
      </p>

      <div className="flex gap-2 mb-8 text-sm flex-wrap">
        <a
          href="/timeline"
          className={`rounded-full px-3 py-1 border ${
            !sceneFilter
              ? "border-zinc-50 text-zinc-50"
              : "border-zinc-700 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          All
        </a>
        {scenes?.map((s) => (
          <a
            key={s.slug}
            href={`/timeline?scene=${s.slug}`}
            className={`rounded-full px-3 py-1 border ${
              sceneFilter === s.slug
                ? "border-zinc-50 text-zinc-50"
                : "border-zinc-700 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {s.name}
          </a>
        ))}
      </div>

      <ol className="relative border-l border-zinc-800 ml-3">
        {items.map((item: any, i: number) => (
          <li key={i} className="ml-6 mb-8">
            <span className="absolute -left-1.5 flex h-3 w-3 rounded-full bg-zinc-50" />
            <p className="text-sm text-zinc-500">{item.gear.release_year}</p>
            <p className="font-semibold">{item.gear.name}</p>
            <p className="text-sm text-zinc-400">{item.gear.category}</p>
          </li>
        ))}
        {!items.length && (
          <p className="text-zinc-500 text-sm">No gear for this filter yet.</p>
        )}
      </ol>
    </div>
  );
}
