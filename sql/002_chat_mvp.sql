-- ============================================================
-- MUSICBOND — Chat MVP schema (channels + messages)
-- Τρέξε αυτό στο Supabase SQL Editor αφού υπάρχει ήδη ο πίνακας
-- `profiles` (βλ. README.md).
-- ============================================================

-- ---- CHANNELS ----------------------------------------------
create table if not exists channels (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,          -- π.χ. 'general', 'jam-sessions'
  topic text,                          -- σύντομη περιγραφή, εμφανίζεται στο header
  position int not null default 0,     -- σειρά εμφάνισης στο sidebar
  created_at timestamptz not null default now()
);

alter table channels enable row level security;

create policy "Authenticated users can read channels"
  on channels for select
  to authenticated
  using (true);

-- Seed βασικά κανάλια (no-op αν υπάρχουν ήδη)
insert into channels (name, topic, position) values
  ('general',      'Πες γεια, μίλα για ό,τι θες',          0),
  ('jam-sessions', 'Οργάνωσε/βρες jam και rehearsal',       1),
  ('gear-talk',    'Όργανα, pedals, home studio setups',    2),
  ('show-flyers',  'Ανέβασε flyers για συναυλίες/gigs',     3)
on conflict (name) do nothing;

-- ---- MESSAGES ------------------------------------------------
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references channels(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,             -- snapshot, ώστε να μη χρειάζεται join για render
  content text not null check (char_length(trim(content)) > 0 and char_length(content) <= 2000),
  created_at timestamptz not null default now()
);

create index if not exists messages_channel_created_idx
  on messages (channel_id, created_at);

alter table messages enable row level security;

create policy "Authenticated users can read messages"
  on messages for select
  to authenticated
  using (true);

create policy "Users can insert their own messages"
  on messages for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ---- REALTIME --------------------------------------------------
-- Ενεργοποίηση realtime broadcast στον πίνακα messages, ώστε το
-- chat να ενημερώνεται live χωρίς refresh.
alter publication supabase_realtime add table messages;
