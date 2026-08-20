-- GrooveIQ initial schema
-- Entities: scenes, artists, labels, gear, venues, tracks, primary_sources,
-- lessons/lesson_cards, ask_questions, user progress/badges.
-- Relationship tables model the many-to-many content graph (artist<->scene,
-- label<->scene, artist influence edges, label genealogy).

create extension if not exists "pgcrypto";

-- ============ Core content ============

create table scenes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  city text,
  era_start smallint,
  era_end smallint,            -- null = "present"
  anchor_venue text,
  key_figures text,
  order_index smallint not null default 0,
  overview text,
  dj_culture text,
  dance_styles text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table artists (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  bio text,
  birth_year smallint,
  active_years text,
  musicbrainz_id text,
  discogs_id text,
  spotify_artist_id text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table labels (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  founding_story text,
  founded_year smallint,
  city text,
  discogs_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table gear (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,           -- e.g. "TB-303", "Moog", "Traktor"
  category text,                -- synth, drum machine, sampler, DAW, mixer, etc.
  release_year smallint,
  manufacturer text,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

create table venues (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  city text,
  scene_id uuid references scenes(id) on delete set null,
  years_active text,
  description text,
  created_at timestamptz not null default now()
);

create table tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist_id uuid references artists(id) on delete set null,
  scene_id uuid references scenes(id) on delete set null,
  label_id uuid references labels(id) on delete set null,
  release_year smallint,
  spotify_track_id text,
  notes text,                   -- why this track matters / lesson context
  created_at timestamptz not null default now()
);

create table primary_sources (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid references scenes(id) on delete cascade,
  kind text not null check (kind in ('flyer', 'quote', 'article', 'photo')),
  title text,
  source_name text,             -- e.g. "Rave Preservation Project", "Dancecult Journal"
  source_url text,
  image_url text,
  body text,                    -- quote text or excerpt
  attribution text,
  created_at timestamptz not null default now()
);

-- ============ Relationship / graph tables ============

create table artist_scenes (
  artist_id uuid references artists(id) on delete cascade,
  scene_id uuid references scenes(id) on delete cascade,
  influence_rating smallint check (influence_rating between 1 and 10),
  role text,                     -- producer, DJ, vocalist, engineer...
  primary key (artist_id, scene_id)
);

create table artist_influences (
  id uuid primary key default gen_random_uuid(),
  from_artist_id uuid references artists(id) on delete cascade,
  to_artist_id uuid references artists(id) on delete cascade,
  weight smallint check (weight between 1 and 10) default 5,
  note text,
  unique (from_artist_id, to_artist_id)
);

create table label_scenes (
  label_id uuid references labels(id) on delete cascade,
  scene_id uuid references scenes(id) on delete cascade,
  primary key (label_id, scene_id)
);

create table label_artists (
  label_id uuid references labels(id) on delete cascade,
  artist_id uuid references artists(id) on delete cascade,
  notes text,
  primary key (label_id, artist_id)
);

create table label_genealogy (
  id uuid primary key default gen_random_uuid(),
  parent_label_id uuid references labels(id) on delete cascade,
  child_label_id uuid references labels(id) on delete cascade,
  relationship text,             -- "spawned", "sub-label", "founded by alumni of"
  unique (parent_label_id, child_label_id)
);

create table gear_scenes (
  gear_id uuid references gear(id) on delete cascade,
  scene_id uuid references scenes(id) on delete cascade,
  primary key (gear_id, scene_id)
);

-- ============ Learning layer ============

create table lessons (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid references scenes(id) on delete cascade,
  order_index smallint not null default 0,
  title text not null,
  created_at timestamptz not null default now()
);

create table lesson_cards (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  order_index smallint not null default 0,
  card_type text not null check (card_type in ('context', 'listen', 'connect', 'quiz', 'unlock')),
  content jsonb not null default '{}'::jsonb,   -- shape varies by card_type
  created_at timestamptz not null default now()
);

create table ask_questions (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid references scenes(id) on delete set null,
  question text not null,
  is_curated boolean not null default true,
  order_index smallint not null default 0,
  created_at timestamptz not null default now()
);

-- ============ User layer ============
-- profiles extends Supabase auth.users 1:1

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  streak_count smallint not null default 0,
  last_active_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table badges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  scene_id uuid references scenes(id) on delete set null
);

create table user_badges (
  user_id uuid references profiles(id) on delete cascade,
  badge_id uuid references badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table user_progress (
  user_id uuid references profiles(id) on delete cascade,
  scene_id uuid references scenes(id) on delete cascade,
  lessons_completed smallint not null default 0,
  is_scene_complete boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, scene_id)
);

-- ============ Indexes ============

create index idx_artist_scenes_scene on artist_scenes(scene_id);
create index idx_label_scenes_scene on label_scenes(scene_id);
create index idx_gear_scenes_scene on gear_scenes(scene_id);
create index idx_tracks_scene on tracks(scene_id);
create index idx_primary_sources_scene on primary_sources(scene_id);
create index idx_lessons_scene on lessons(scene_id);
create index idx_lesson_cards_lesson on lesson_cards(lesson_id);
create index idx_artist_influences_from on artist_influences(from_artist_id);
create index idx_artist_influences_to on artist_influences(to_artist_id);

-- ============ Row Level Security ============
-- Content tables: public read, writes restricted to service role.
-- User tables: users can only read/write their own rows.

alter table scenes enable row level security;
alter table artists enable row level security;
alter table labels enable row level security;
alter table gear enable row level security;
alter table venues enable row level security;
alter table tracks enable row level security;
alter table primary_sources enable row level security;
alter table artist_scenes enable row level security;
alter table artist_influences enable row level security;
alter table label_scenes enable row level security;
alter table label_artists enable row level security;
alter table label_genealogy enable row level security;
alter table gear_scenes enable row level security;
alter table lessons enable row level security;
alter table lesson_cards enable row level security;
alter table ask_questions enable row level security;
alter table badges enable row level security;
alter table profiles enable row level security;
alter table user_badges enable row level security;
alter table user_progress enable row level security;

create policy "public read" on scenes for select using (true);
create policy "public read" on artists for select using (true);
create policy "public read" on labels for select using (true);
create policy "public read" on gear for select using (true);
create policy "public read" on venues for select using (true);
create policy "public read" on tracks for select using (true);
create policy "public read" on primary_sources for select using (true);
create policy "public read" on artist_scenes for select using (true);
create policy "public read" on artist_influences for select using (true);
create policy "public read" on label_scenes for select using (true);
create policy "public read" on label_artists for select using (true);
create policy "public read" on label_genealogy for select using (true);
create policy "public read" on gear_scenes for select using (true);
create policy "public read" on lessons for select using (true);
create policy "public read" on lesson_cards for select using (true);
create policy "public read" on ask_questions for select using (true);
create policy "public read" on badges for select using (true);

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own badges" on user_badges for all using (auth.uid() = user_id);
create policy "own progress" on user_progress for all using (auth.uid() = user_id);
