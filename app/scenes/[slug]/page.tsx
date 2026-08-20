import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "artists", label: "Artists" },
  { key: "labels", label: "Labels + Gear" },
  { key: "culture", label: "DJ Culture" },
] as const;

export default async function ScenePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug } = await params;
  const { tab = "overview" } = await searchParams;

  const { data: scene } = await supabase
    .from("scenes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!scene) notFound();

  const [{ data: artistLinks }, { data: labelLinks }, { data: gearLinks }] =
    await Promise.all([
      supabase
        .from("artist_scenes")
        .select("role, influence_rating, artists(slug, name, bio)")
        .eq("scene_id", scene.id),
      supabase
        .from("label_scenes")
        .select("labels(slug, name, founding_story)")
        .eq("scene_id", scene.id),
      supabase
        .from("gear_scenes")
        .select("gear(slug, name, category, release_year)")
        .eq("scene_id", scene.id),
    ]);

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">{scene.name}</h1>
      <p className="text-sm text-zinc-400 mt-1">
        {scene.city} · {scene.era_start}–{scene.era_end ?? "present"} ·{" "}
        {scene.anchor_venue}
      </p>

      <div className="flex gap-4 mt-6 border-b border-zinc-800 text-sm font-medium">
        {TABS.map((t) => (
          <a
            key={t.key}
            href={`?tab=${t.key}`}
            className={`pb-3 -mb-px border-b-2 ${
              tab === t.key
                ? "border-zinc-50 text-zinc-50"
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      <div className="mt-6">
        {tab === "overview" && (
          <div className="space-y-3 text-zinc-300">
            <p>{scene.overview ?? "Overview content coming soon."}</p>
            <p className="text-sm text-zinc-500">
              Key figures: {scene.key_figures}
            </p>
          </div>
        )}

        {tab === "artists" && (
          <ul className="space-y-3">
            {artistLinks?.map((link: any, i: number) => (
              <li
                key={i}
                className="rounded border border-zinc-800 p-4"
              >
                <p className="font-semibold">{link.artists?.name}</p>
                {link.role && (
                  <p className="text-xs text-zinc-500">{link.role}</p>
                )}
                <p className="text-sm text-zinc-400 mt-1">
                  {link.artists?.bio ?? "Bio coming soon."}
                </p>
              </li>
            ))}
            {!artistLinks?.length && (
              <p className="text-zinc-500 text-sm">No artists added yet.</p>
            )}
          </ul>
        )}

        {tab === "labels" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-400 mb-2">
                Labels
              </h3>
              <ul className="space-y-2">
                {labelLinks?.map((link: any, i: number) => (
                  <li key={i} className="rounded border border-zinc-800 p-3">
                    <p className="font-medium">{link.labels?.name}</p>
                    <p className="text-sm text-zinc-500">
                      {link.labels?.founding_story ?? "Founding story coming soon."}
                    </p>
                  </li>
                ))}
                {!labelLinks?.length && (
                  <p className="text-zinc-500 text-sm">No labels added yet.</p>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-400 mb-2">
                Gear
              </h3>
              <ul className="flex flex-wrap gap-2">
                {gearLinks?.map((link: any, i: number) => (
                  <li
                    key={i}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-sm"
                  >
                    {link.gear?.name}{" "}
                    <span className="text-zinc-500">
                      ({link.gear?.release_year})
                    </span>
                  </li>
                ))}
                {!gearLinks?.length && (
                  <p className="text-zinc-500 text-sm">No gear added yet.</p>
                )}
              </ul>
            </div>
          </div>
        )}

        {tab === "culture" && (
          <div className="space-y-3 text-zinc-300">
            <p>{scene.dj_culture ?? "DJ culture content coming soon."}</p>
            <p className="text-zinc-400">
              {scene.dance_styles ?? "Dance styles content coming soon."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
