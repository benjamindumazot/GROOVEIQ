-- ============================================================
-- GrooveIQ quiz engine
-- ============================================================

-- Add XP + level to profiles
alter table profiles
  add column if not exists xp integer not null default 0,
  add column if not exists level integer not null default 1;

-- Question bank
create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  options jsonb not null,         -- ["opt A", "opt B", "opt C", "opt D"]
  correct_index smallint not null, -- 0-3
  explanation text,
  scene_id uuid references scenes(id) on delete set null,
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  category text,                  -- 'history', 'gear', 'artists', 'labels', 'culture'
  created_at timestamptz not null default now()
);

-- Daily challenge attempts (one per user per UTC date)
create table challenge_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  challenge_date date not null default current_date,
  score smallint not null,        -- number correct (0-5)
  xp_earned smallint not null default 0,
  answers jsonb not null default '[]'::jsonb, -- [{question_id, chosen, correct}]
  completed_at timestamptz not null default now(),
  unique (user_id, challenge_date)
);

-- RLS
alter table quiz_questions enable row level security;
alter table challenge_attempts enable row level security;

create policy "public read" on quiz_questions for select using (true);
create policy "own attempts" on challenge_attempts for all using (auth.uid() = user_id);

-- Indexes
create index idx_challenge_attempts_user on challenge_attempts(user_id);
create index idx_quiz_questions_scene on quiz_questions(scene_id);
