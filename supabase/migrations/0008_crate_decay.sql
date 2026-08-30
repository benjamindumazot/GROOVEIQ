-- Add last_touched_at to user_progress for crate decay tracking
alter table user_progress
  add column if not exists last_touched_at timestamptz;
