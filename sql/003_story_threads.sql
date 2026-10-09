-- ============================================================
-- MUSICBOND — Νήματα ανά τραγούδι (σύνδεση με «Ταξίδι στη Μουσική»)
-- Τρέξε το ΜΕΤΑ το 002_chat_mvp.sql.
--
-- Κάθε ιστορία του site αποκτά ένα κανάλι τύπου 'story' στο Musicbond.
-- Τα κανάλια αυτά δημιουργούνται αυτόματα την πρώτη φορά που κάποιος
-- ανοίγει το νήμα (μέσω της συνάρτησης get_or_create_story_channel).
-- ============================================================

alter table channels
  add column if not exists kind text not null default 'text'
    check (kind in ('text', 'story'));

alter table channels
  add column if not exists story_slug text unique;

alter table channels
  add column if not exists story_url text;

-- Οι χρήστες ΔΕΝ μπορούν να κάνουν insert απευθείας στον πίνακα channels
-- (δεν υπάρχει insert policy). Μόνο μέσω αυτής της συνάρτησης, που ελέγχει
-- το slug και δεν φτιάχνει ποτέ διπλό νήμα για το ίδιο τραγούδι.
create or replace function get_or_create_story_channel(p_slug text, p_title text, p_url text)
returns channels
language plpgsql
security definer
set search_path = public
as $$
declare
  ch channels;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  if p_slug is null or p_slug !~ '^[a-z0-9-]{1,80}$' then
    raise exception 'invalid story slug';
  end if;

  if p_url is not null and p_url !~ '^https://' then
    raise exception 'invalid story url';
  end if;

  select * into ch from channels where story_slug = p_slug;
  if found then
    return ch;
  end if;

  insert into channels (name, topic, position, kind, story_slug, story_url)
  values (
    'story-' || p_slug,
    left(coalesce(nullif(trim(p_title), ''), p_slug), 200),
    1000,
    'story',
    p_slug,
    p_url
  )
  on conflict (story_slug) do nothing
  returning * into ch;

  -- Αν δύο χρήστες το άνοιξαν ταυτόχρονα, το insert του ενός δεν κάνει τίποτα
  if ch.id is null then
    select * into ch from channels where story_slug = p_slug;
  end if;

  return ch;
end;
$$;

revoke all on function get_or_create_story_channel(text, text, text) from public, anon;
grant execute on function get_or_create_story_channel(text, text, text) to authenticated;
