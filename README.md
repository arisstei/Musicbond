# MusicBond HQ

**Τρέχουσα φάση: MVP.** Ο στόχος αυτής της φάσης είναι ένα πράγμα: μια
εφαρμογή καλής ποιότητας όπου οι μουσικοί γνωρίζονται και μιλάνε — σαν το
Discord. Κανάλια κειμένου, real-time μηνύματα, τίποτα άλλο.

Metaverse/gamification στοιχεία (Music DNA, Districts/Χάρτης, Ιστορικοί,
Crate Digging, Sound Escaping, NFTs, Unity 3D Experience) περιγράφονται στο
`DESIGN_BIBLE.md` §5 ως το **μακροπρόθεσμο όραμα**, αλλά δεν είναι μέρος
του τρέχοντος build. Δεν τα αγγίζουμε πριν δουλέψει καλά το βασικό chat.

**Πριν κάνεις οποιαδήποτε οπτική αλλαγή, διάβασε το `DESIGN_BIBLE.md`** —
η αισθητική είναι "Cult 80-90-00" (φωτοτυπημένο fanzine/DIY flyer), όχι
comic-book.

## Stack

- React 19 + Vite
- Supabase (Auth + Postgres + Realtime)
- Οπτική ταυτότητα: `src/styles/comic-theme.css` (design tokens — ιστορικό
  filename, βλ. σχόλιο στην κορυφή) + `src/styles/chat.css` (layout του chat)

## Ρύθμιση Supabase

1. Αντέγραψε το `.env.example` σε `.env` και βάλε τα credentials σου:

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

2. Πίνακας `profiles` (αν δεν υπάρχει ήδη):

```sql
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  username text,
  current_color text,        -- μελλοντικό: Music DNA
  preferences jsonb,          -- μελλοντικό: Music DNA
  current_district text       -- μελλοντικό: χάρτης
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
```

3. **Chat MVP** — τρέξε `sql/002_chat_mvp.sql` στο Supabase SQL Editor. Φτιάχνει
   τους πίνακες `channels` και `messages`, RLS policies, seed κανάλια, και
   ενεργοποιεί realtime στα μηνύματα.

4. **Νήματα τραγουδιών** — τρέξε `sql/003_story_threads.sql` (μετά το 002).

## Σύνδεση με «Ταξίδι στη Μουσική»

Κάθε ιστορία του [Ταξίδι στη Μουσική](https://taksidi-stin-mousiki.vercel.app)
(repo `arisstei/taksidi-stin-mousiki`) αποκτά δικό της νήμα συζήτησης εδώ.

- Το site εκθέτει δημόσιο feed στο `/api/songs`. Το Musicbond το διαβάζει και
  δείχνει την ενότητα «Ιστορίες τραγουδιών» στο sidebar.
- Σε κάθε ιστορία του site υπάρχει κουμπί «Συζήτησέ το», που οδηγεί στο
  `https://<musicbond>/?story=<slug>` και ανοίγει κατευθείαν το σωστό νήμα,
  ακόμα κι αν ο χρήστης πρέπει πρώτα να συνδεθεί.
- Το νήμα δημιουργείται αυτόματα την πρώτη φορά (RPC `get_or_create_story_channel`).
- Οι αλλαγές για το site είναι στο `integrations/taksidi-musicbond-link.patch`.
  Το κουμπί εμφανίζεται μόνο όταν οριστεί στο Vercel του site το env var
  `NEXT_PUBLIC_MUSICBOND_URL`.

## Εκκίνηση

```bash
npm install
npm run dev
```

## Ροή εφαρμογής (MVP)

1. `AuthScreen` — εγγραφή/είσοδος με email+password (Supabase Auth)
2. `ProfileSetup` — μόνο username (χωρίς quiz — αυτό έρχεται αργότερα)
3. `ChatApp` — κανάλια στο sidebar + real-time μηνύματα ανά κανάλι

## Δομή φακέλων

```
src/
  components/
    auth/          AuthScreen (ενεργό) · LoginScreen (παλιό, unused)
    profile/       ProfileSetup (ενεργό)
    chat/          ChatApp, ChannelSidebar, ChatWindow (MVP core)
    onboarding/    OnboardingWizard (Music DNA — μελλοντική φάση, unused)
    dashboard/     Dashboard (μελλοντική φάση, unused)
    landing/       Hero, FeaturesGrid, MapSection (μελλοντική φάση, unused)
    common/        ComicButton, ComicCard (παλιά, βλ. ui/ για νέα)
    ui/            Panel, Button (νέα, ίδια tokens, χωρίς "Comic" naming)
  styles/          comic-theme.css (design tokens) + chat.css (layout)
  lib/             supabaseClient
  _legacy/         παλιός κώδικας — μην κάνεις import από εδώ
sql/               002_chat_mvp.sql — schema για channels/messages
backups/           zip backups
```

Τα components κάτω από `onboarding/`, `dashboard/`, `landing/` δεν
διαγράφηκαν (ίσως χρειαστούν στη μελλοντική φάση) αλλά δεν είναι πλέον
στο active path — το `App.jsx` δεν κάνει πια import από αυτά.
