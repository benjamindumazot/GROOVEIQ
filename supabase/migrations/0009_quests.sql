-- ============================================================
-- GrooveIQ — Quests system
-- ============================================================

-- Quest definitions (seeded, not user-generated)
create table quests (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  scene_slugs jsonb not null default '[]'::jsonb, -- scenes to draw questions from
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  question_count smallint not null default 6,
  badge_name text not null,
  badge_emoji text not null default '🎵',
  xp_reward smallint not null default 150,
  order_index smallint not null default 0,
  created_at timestamptz not null default now()
);

-- Per-user quest completions
create table user_quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  quest_id uuid references quests(id) on delete cascade not null,
  score smallint not null,
  xp_earned smallint not null,
  answers jsonb not null default '[]'::jsonb,
  completed_at timestamptz not null default now(),
  unique (user_id, quest_id) -- one completion per quest per user
);

-- RLS
alter table quests enable row level security;
alter table user_quests enable row level security;
create policy "public read" on quests for select using (true);
create policy "own quests" on user_quests for all using (auth.uid() = user_id);

-- Seed: 3 launch quests
insert into quests (slug, title, description, scene_slugs, difficulty, question_count, badge_name, badge_emoji, xp_reward, order_index)
values
(
  'origin-story',
  'The Origin Story',
  'Trace the lineage from David Mancuso''s living room at 647 Broadway to Frankie Knuckles in Chicago. The complete origin story of DJ culture — every scene that came after owes something to what happened here.',
  '["disco-roots", "ny-garage", "chicago-house"]'::jsonb,
  'medium',
  6,
  'Crate Digger',
  '📦',
  200,
  0
),
(
  'belleville-three',
  'The Belleville Three',
  'Three teenagers in a Detroit suburb absorbed Kraftwerk and Parliament through a late-night radio show and invented a new genre. Deep dive into Detroit techno — the machines, the clubs, the people, the movement.',
  '["detroit-techno"]'::jsonb,
  'hard',
  5,
  'Detroit Purist',
  '⚙️',
  250,
  1
),
(
  'detroit-to-berlin',
  'Detroit to Berlin',
  'The Wall came down and Berlin absorbed Detroit''s sound. How did three Black Midwestern teenagers end up defining the nightlife of a reunified German city? This is the transatlantic axis that shaped global techno.',
  '["detroit-techno", "berlin-techno"]'::jsonb,
  'hard',
  6,
  'Transatlantic Head',
  '✈️',
  300,
  2
);
