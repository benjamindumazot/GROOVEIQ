import { getServiceClient } from "@/lib/supabase";

export const revalidate = 0;

export default async function LabelsPage() {
  const supabase = getServiceClient();
  const { data: labels } = await supabase
    .from("labels")
    .select("slug, name, founding_story, founded_year, city, label_scenes(scenes(name))")
    .order("name");

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Labels</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {labels?.map((label: any) => (
          <div
            key={label.slug}
            className="rounded-lg border border-zinc-800 p-5"
          >
            <h2 className="text-lg font-semibold">{label.name}</h2>
            <p className="text-sm text-zinc-500 mt-1">
              {label.city ?? "—"}
              {label.founded_year ? ` · founded ${label.founded_year}` : ""}
            </p>
            <p className="text-sm text-zinc-400 mt-2">
              {label.founding_story ?? "Founding story coming soon."}
            </p>
            {label.label_scenes?.length ? (
              <p className="text-xs text-zinc-600 mt-3">
                Scenes: {label.label_scenes.map((ls: any) => ls.scenes?.name).join(", ")}
              </p>
            ) : null}
          </div>
        ))}
        {!labels?.length && (
          <p className="text-zinc-500 text-sm">No labels added yet.</p>
        )}
      </div>
    </div>
  );
}
