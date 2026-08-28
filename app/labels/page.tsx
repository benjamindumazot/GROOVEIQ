import { getServiceClient } from "@/lib/supabase";

export const revalidate = 0;

export default async function LabelsPage() {
  const supabase = getServiceClient();
  const { data: labels } = await supabase
    .from("labels")
    .select("slug, name, founding_story, founded_year, city, label_scenes(scenes(name))")
    .order("name");

  return (
    <div className="px-6 py-14 max-w-5xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-mono tracking-[0.3em] text-indigo-400 uppercase mb-3">Infrastructure</p>
        <h1 className="text-4xl font-black tracking-tight">Labels</h1>
        <p className="text-zinc-500 mt-2 text-sm">The imprints that documented and distributed the culture.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {labels?.map((label: any) => {
          const sceneNames: string[] = label.label_scenes
            ?.map((ls: any) => ls.scenes?.name)
            .filter(Boolean) ?? [];
          return (
            <div
              key={label.slug}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-xl font-black tracking-tight text-white">{label.name}</h2>
                {label.founded_year && (
                  <span className="text-xs font-mono text-zinc-600 bg-zinc-800 px-2 py-1 rounded-md shrink-0">
                    est. {label.founded_year}
                  </span>
                )}
              </div>
              {label.city && (
                <p className="text-xs font-mono text-zinc-500 mb-3 tracking-wider uppercase">{label.city}</p>
              )}
              <p className="text-sm text-zinc-400 leading-relaxed">
                {label.founding_story ?? "Founding story coming soon."}
              </p>
              {sceneNames.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-4">
                  {sceneNames.map((name) => (
                    <span key={name} className="text-[11px] font-semibold text-indigo-400 bg-indigo-950/50 border border-indigo-900 px-2 py-0.5 rounded-full">
                      {name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {!labels?.length && (
          <p className="text-zinc-600 text-sm">No labels added yet.</p>
        )}
      </div>
    </div>
  );
}
