import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function ScenesPage() {
  const { data: scenes } = await supabase
    .from("scenes")
    .select("slug, name, city, era_start, era_end, anchor_venue, key_figures")
    .order("order_index");

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Scenes</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {scenes?.map((scene) => (
          <Link
            key={scene.slug}
            href={`/scenes/${scene.slug}`}
            className="block rounded-lg border border-zinc-800 p-5 hover:border-zinc-500 transition-colors"
          >
            <h2 className="text-lg font-semibold">{scene.name}</h2>
            <p className="text-sm text-zinc-400 mt-1">
              {scene.city} · {scene.era_start}–{scene.era_end ?? "present"}
            </p>
            <p className="text-sm text-zinc-500 mt-2">{scene.anchor_venue}</p>
            <p className="text-xs text-zinc-600 mt-1">{scene.key_figures}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
