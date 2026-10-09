-- ============================================================
-- MUSICBOND — Προφίλ-δωμάτιο (2D, στυλ 80s/90s)
-- Τρέξε το ΜΕΤΑ το 002_chat_mvp.sql.
--
-- Κάθε χρήστης έχει ΕΝΑ δωμάτιο. Το layout (τοίχος, πάτωμα, αντικείμενα)
-- αποθηκεύεται ως JSON. Το δωμάτιο είναι 'private' (μόνο ο ιδιοκτήτης)
-- ή 'public' (το βλέπουν όλοι οι συνδεδεμένοι χρήστες).
-- Ο πίνακας `profiles` ΔΕΝ αλλάζει.
-- ============================================================

create table if not exists rooms (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,                       -- snapshot, για τη λίστα επισκέψεων
  layout jsonb not null default '{}'::jsonb,
  now_playing text                              -- link YouTube / Spotify / SoundCloud
    check (now_playing is null or (char_length(now_playing) <= 500 and now_playing ~ '^https://')),
  visibility text not null default 'private'
    check (visibility in ('private', 'public')),
  updated_at timestamptz not null default now(),
  check (pg_column_size(layout) <= 20000)
);

create index if not exists rooms_public_idx
  on rooms (updated_at desc) where visibility = 'public';

alter table rooms enable row level security;

create policy "Read own room or public rooms"
  on rooms for select
  to authenticated
  using (visibility = 'public' or auth.uid() = user_id);

create policy "Insert own room"
  on rooms for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Update own room"
  on rooms for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Delete own room"
  on rooms for delete
  to authenticated
  using (auth.uid() = user_id);
