import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load .env.local manually (no dotenv dependency needed for a one-off script)
const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const scenes = [
  {
    slug: "ny-garage",
    name: "NY Garage",
    city: "New York",
    era_start: 1977,
    era_end: 1987,
    anchor_venue: "Paradise Garage",
    key_figures: "Larry Levan",
    order_index: 0,
  },
  {
    slug: "chicago-house",
    name: "Chicago House",
    city: "Chicago",
    era_start: 1983,
    era_end: 1990,
    anchor_venue: "The Warehouse / Music Box",
    key_figures: "Frankie Knuckles / Ron Hardy",
    order_index: 1,
  },
  {
    slug: "detroit-techno",
    name: "Detroit Techno",
    city: "Detroit",
    era_start: 1985,
    era_end: 1993,
    anchor_venue: "Music Institute",
    key_figures: "Derrick May / Kevin Saunderson / Juan Atkins",
    order_index: 2,
  },
  {
    slug: "berlin-techno",
    name: "Berlin Techno",
    city: "Berlin",
    era_start: 1989,
    era_end: null,
    anchor_venue: "Tresor / Berghain",
    key_figures: "DJ Hell / Sven Väth / Jeff Mills",
    order_index: 3,
  },
];

const artists = [
  { slug: "larry-levan", name: "Larry Levan", scene: "ny-garage" },
  { slug: "frankie-knuckles", name: "Frankie Knuckles", scene: "chicago-house" },
  { slug: "ron-hardy", name: "Ron Hardy", scene: "chicago-house" },
  { slug: "derrick-may", name: "Derrick May", scene: "detroit-techno" },
  { slug: "kevin-saunderson", name: "Kevin Saunderson", scene: "detroit-techno" },
  { slug: "juan-atkins", name: "Juan Atkins", scene: "detroit-techno" },
  { slug: "dj-hell", name: "DJ Hell", scene: "berlin-techno" },
  { slug: "sven-vath", name: "Sven Väth", scene: "berlin-techno" },
  { slug: "jeff-mills", name: "Jeff Mills", scene: "berlin-techno" },
];

const labels = [
  { slug: "trax", name: "Trax Records", scene: "chicago-house" },
  { slug: "metroplex", name: "Metroplex", scene: "detroit-techno" },
  { slug: "transmat", name: "Transmat", scene: "detroit-techno" },
  { slug: "tresor", name: "Tresor", scene: "berlin-techno" },
  { slug: "west-end", name: "West End Records", scene: "ny-garage" },
];

const gear = [
  { slug: "moog", name: "Moog", category: "synth", release_year: 1968 },
  { slug: "tr-808", name: "TR-808", category: "drum machine", release_year: 1980 },
  { slug: "tr-909", name: "TR-909", category: "drum machine", release_year: 1983 },
  { slug: "tb-303", name: "TB-303", category: "synth", release_year: 1981 },
  { slug: "traktor", name: "Traktor", category: "DAW", release_year: 2001 },
];

async function upsert(table, rows, conflictCol = "slug") {
  const { data, error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflictCol })
    .select();
  if (error) throw new Error(`${table}: ${error.message}`);
  return data;
}

async function main() {
  const sceneRows = await upsert("scenes", scenes);
  const sceneBySlug = Object.fromEntries(sceneRows.map((s) => [s.slug, s]));

  const artistRows = await upsert(
    "artists",
    artists.map(({ slug, name }) => ({ slug, name }))
  );
  const artistBySlug = Object.fromEntries(artistRows.map((a) => [a.slug, a]));

  const labelRows = await upsert(
    "labels",
    labels.map(({ slug, name }) => ({ slug, name }))
  );
  const labelBySlug = Object.fromEntries(labelRows.map((l) => [l.slug, l]));

  const gearRows = await upsert("gear", gear);

  await upsert(
    "artist_scenes",
    artists.map((a) => ({
      artist_id: artistBySlug[a.slug].id,
      scene_id: sceneBySlug[a.scene].id,
    })),
    "artist_id,scene_id"
  );

  await upsert(
    "label_scenes",
    labels.map((l) => ({
      label_id: labelBySlug[l.slug].id,
      scene_id: sceneBySlug[l.scene].id,
    })),
    "label_id,scene_id"
  );

  // Gear timeline isn't scene-exclusive (e.g. Moog/808 predate and span scenes),
  // so link every gear item to every scene whose era it overlaps.
  const gearSceneLinks = [];
  for (const g of gearRows) {
    for (const s of sceneRows) {
      const sceneEnd = s.era_end ?? new Date().getFullYear();
      if (g.release_year <= sceneEnd) {
        gearSceneLinks.push({ gear_id: g.id, scene_id: s.id });
      }
    }
  }
  await upsert("gear_scenes", gearSceneLinks, "gear_id,scene_id");

  console.log(
    `Seeded ${sceneRows.length} scenes, ${artistRows.length} artists, ${labelRows.length} labels, ${gearRows.length} gear items.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
