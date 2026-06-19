create table if not exists docs_feedback (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  article_slug text not null,
  helpful     boolean not null,
  comment     text,
  user_id     uuid references auth.users(id) on delete set null
);

alter table docs_feedback enable row level security;

-- Anyone can insert (logged-in or anonymous)
create policy "insert docs feedback"
  on docs_feedback for insert
  with check (true);

-- Users can read only their own feedback
create policy "select own docs feedback"
  on docs_feedback for select
  using (auth.uid() = user_id);

-- Index for querying by article
create index on docs_feedback (article_slug);
