# MUSICBOND — DESIGN BIBLE

> **Για κάθε AI εργαλείο (Windsurf, Cursor, Claude κ.λπ.) και κάθε συνεργάτη:**
> Διάβασε ΟΛΟΚΛΗΡΟ αυτό το αρχείο πριν γράψεις ή αλλάξεις οτιδήποτε οπτικό ή UX.
>
> **Ιστορικό:** η πρώτη εκδοχή αυτού του εγγράφου έλεγε "comic style" και το
> αποτέλεσμα βγήκε πολύ κυριολεκτικά comic-book (speech bubbles, POW!,
> Comic Sans, cartoon χρώματα). Αυτό ΔΕΝ ήταν η πρόθεση. Η σωστή κατεύθυνση
> περιγράφεται παρακάτω.

---

## ⚠️ ΕΝΗΜΕΡΩΣΗ (Σεπτέμβριος 2026) — ΤΡΕΧΟΥΣΑ ΚΑΤΕΥΘΥΝΣΗ: «ARCHIVE NOIR»

Ο Άριστείδης επέλεξε νέα οπτική κατεύθυνση, εμπνευσμένη από το ύφος του
therecord.institute (έμπνευση ύφους, όχι αντιγραφή). **Αυτή υπερισχύει όπου
συγκρούεται με τις ενότητες 2-3 παρακάτω** (χαρτί, ταινία, flat σκιές,
«όχι dark mode»):

- **Σκοτεινή αίθουσα αρχείου/μουσείου**: φόντο σχεδόν μαύρο, ζεστό (`#121110`),
  κείμενο «περγαμηνή» (`#d4c5a9`), ορειχάλκινο/χρυσό (`#b89947`) για γραμμές & τονισμούς.
- **Φως προβολέα** από πάνω (κώνος που τρεμοπαίζει ελάχιστα) — τα μηνύματα/προφίλ
  είναι «εκθέματα».
- **Λεπτές χρυσές γραμμές (1px)** και **ορειχάλκινες γωνίες κορνίζας** αντί για ταινία.
- **Τυπογραφία (όλες με ελληνικά!)**: Noto Serif Display σε αραιά κεφαλαία για
  τίτλους, EB Garamond για κείμενο & πλάγια, Anonymous Pro για «γραφομηχανή».
  ΜΗΝ βάλεις Cinzel / Courier Prime / Playfair — δεν έχουν ελληνικά.
- **Κίνηση** (`src/styles/motion.css`): βινύλιο που γυρίζει, VU-meter, VHS glitch,
  κόκκος φιλμ, μηνύματα που «κολλάνε», γύρισμα σελίδας, ticker με ● LIVE.
  Πάντα με σεβασμό στο `prefers-reduced-motion`.
- Υλοποίηση: `src/styles/theme-archive.css` κάνει override τα tokens — τα
  components χρησιμοποιούν μόνο `var(--token)`, άρα αλλαγή θέματος = αλλαγή tokens.
- Ισχύουν ακόμα: όχι comic, όχι neon, όχι generic UI kit, λιτό microcopy,
  ελληνικό UI, το §5 (domain) και το §6 (αρχιτεκτονική).

---

## 1. Το Concept σε μία πρόταση

Το Musicbond είναι ένα **underground/DIY ψηφιακό zine-culture σύμπαν** μέσα στο
οποίο ζει μια μουσική κοινότητα — όχι ένα comic book app.

Έμπνευση — **"Cult 80-90-00"**: φωτοτυπημένα fanzines κολλημένα σε στύλους,
εξώφυλλα VHS από video club της γειτονιάς, J-cards από mixtapes γραμμένα με
στυλό, εξώφυλλα δίσκων φθαρμένα στις άκρες, DIY gig posters από
hardcore/punk ετικέτες (Dischord, Sub Pop), κονκάρδες/patches καρφιτσωμένα σε
τζιν μπουφάν, το πρώιμο MySpace/Xanga με τα "χάλια-αλλά-προσωπικά" layouts του,
crate digging σε δισκάδικα, γειτονιές πόλης (πρώτη πόλη: Ηράκλειο Κρήτης).

**ΔΕΝ είναι**: graphic novel, superhero comic, Ben-Day dots καθαρά και
ομοιόμορφα, cartoon mascots, ονοματοποιίες τύπου POW!/BOOM!, Comic Sans/Bangers
ως ταυτότητα, καθαρά primary-color παλέτα.

## 2. Η χρυσή αρχή: Photocopied Flyer, όχι Comic Panel

Κάθε οθόνη είναι ένα **φωτοτυπημένο flyer/zine page**, όχι ένα comic panel.
Κάθε κάρτα μοιάζει **κολλημένη** (tape στις γωνίες), όχι σχεδιασμένη μέσα σε
πλαίσιο κόμικ. Κάθε μήνυμα είναι σαν **χειρόγραφο σημείωμα στο περιθώριο**,
όχι speech bubble με ουρά κόμικ.

Πρακτικά, όταν σχεδιάζεις ένα νέο feature ρώτα:
1. *Πώς θα το έδειχνε ένα φωτοτυπημένο fanzine ή ένα gig poster;* (όχι «πώς
   το κάνει ένα comic»)
2. *Θα το έβλεπες κολλημένο σε πίνακα ανακοινώσεων δισκάδικου;*
3. *Μοιάζει με κάτι χειροποίητο/ατελές ή με cartoon εικονογράφηση;*
   (πρέπει το πρώτο)

## 3. Οπτική ταυτότητα — υποχρεωτικά στοιχεία

Όλα τα tokens υπάρχουν στο `src/styles/comic-theme.css` (ιστορικό filename —
το περιεχόμενο είναι πλέον "Cult 80-90-00", όχι comic). Χρησιμοποίησε ΑΥΤΑ,
όχι νέα αυθαίρετα χρώματα/fonts, και ΠΑΝΤΑ μέσω `var(--token)` — ποτέ
hardcoded hex μέσα σε inline styles ή components.

| Στοιχείο | Κανόνας |
|---|---|
| Φόντο | Παλιωμένο «χαρτί» `--paper` (όχι φωτεινό κίτρινο) με λεπτό grain/xerox noise — ποτέ καθαρό λευκό full-page, ποτέ dark mode default |
| Χρώματα | Μικρή, **ξεθωριασμένη** παλέτα risograph/xerox (`--accent-*`) — ΟΧΙ neon/φωτεινά cartoon χρώματα. Σαν παλιό flyer τυπωμένο σε φτηνό έγχρωμο χαρτί |
| Περιγράμματα | Λεπτό-μεσαίο μαύρο «μελάνι» 2-3px (`--line`, `--line-bold`) — όχι υπερβολικά χοντρό σαν comic outline |
| Σκιές | ΜΟΝΟ flat offset σκιές (`--shadow-flat`), ΠΟΤΕ blur/soft shadows — σαν κολλημένο sticker, όχι comic cel |
| Γωνίες | Μικρή στρογγυλάδα (`--radius-panel: 6px`) — ΟΧΙ μεγάλα rounded-cartoon corners. Εξαίρεση: μικρά ticket/badge tags μπορούν να είναι pill |
| Tape corners | Κάρτες/φωτογραφίες μπορούν να έχουν "κολλητική ταινία" στις γωνίες (`.taped`) — σαν φλυερ κολλημένο σε τοίχο |
| Halftone/grain | Λεπτές κουκκίδες σε φόντα (`.halftone`) — xerox noise, όχι καθαρά comic Ben-Day dots |
| Κλίση | Καρέ και κάρτες με ελαφριά κλίση ±1° (`.tilt-left/.tilt-right`) — σαν κάτι κολλημένο βιαστικά, όχι σχεδιασμένο |
| Τυπογραφία | Τίτλοι: `--font-display` (Oswald, condensed poster/flyer). Ετικέτες/tags: `--font-mono` (IBM Plex Mono, typewriter). Σώμα: `--font-body` (Inter). ΠΟΤΕ Comic Sans/Bangers |
| Animations | Σύντομες, «κολλάει-sticker» μεταβάσεις (`pow-pop`, `bubble-in`) — ΟΧΙ αργά smooth fades, ΟΧΙ υπερβολικό cartoon bounce |
| Microcopy | Λιτή, dry/insider φωνή ("Profile saved.") — ΟΧΙ cartoon exclamatory ("POW! Vibe saved!!") |

## 4. Λεξιλόγιο αλληλεπίδρασης (UX patterns)

- **Chat / μηνύματα** → σημειώματα-σε-περιθώριο (`.speech-bubble`, ήπιο
  styling, όχι comic tail bubble). Σκέψεις → dashed thought bubbles
- **Ειδοποιήσεις / επιτυχίες** → μικρές ετικέτες τύπου ticket-stub (`.sfx`),
  monospace, ΟΧΙ ονοματοποιίες κόμικ (POW!/BOOM!)
- **Loading** → όχι spinners, όχι comic copy· κείμενο τύπου
  *«Loading...»* / *«Φορτώνει...»*, λιτό
- **Empty states** → κενό πάνελ με λιτό κείμενο, όχι comic χαρακτήρας που περιμένει
- **Moderation** → τοξικά μηνύματα: το σημείωμα ξεθωριάζει/θολώνει
- **Μετάβαση σελίδων** → σαν γύρισμα σελίδας fanzine, όχι smooth app transition
- **Ήχος** → οπτικοποιείται λιτά: κυματομορφές, όχι νότες που πετάνε cartoon

## 5. Το σύμπαν του Musicbond (domain — μην τα «απλοποιείς»)

- **Music DNA**: η μουσική ταυτότητα του χρήστη (genre + mood + instrument → χρώμα).
  Εμφανίζεται παντού δίπλα στο όνομα. Δύο χρήστες με συμβατό DNA «συντονίζονται».
- **Ο Χάρτης / Districts**: η πόλη (Ηράκλειο) ως φωτοτυπημένος χάρτης zine —
  ΟΧΙ Google Maps, ΟΧΙ comic illustration. Γειτονιές ανά μουσικό είδος, σπίτια
  με «ζωή» (φώτα, νότες = live listening). Privacy: τυχαία τοποθέτηση, Area
  IDs — ποτέ πραγματική διεύθυνση.
- **Το Σπίτι/Δωμάτιο**: το προφίλ είναι χώρος με Jukebox/πικάπ, όχι σελίδα με πεδία.
- **Ιστορικοί (Historians)**: 20 βαθμίδες (Seeker → Universal Librarian). Γράφουν ιστορικά
  αρχεία τραγουδιών με verified πηγές (Discogs, MusicBrainz, Genius) + peer review.
  Επιβράβευση: **Knowledge Fragments** → συναρμολόγηση οργάνων (Instrumental Assembly).
- **Crate Digging**: ανακάλυψη σπάνιων «δίσκων» σε κρυφά σημεία της πόλης (Diamond Records).
- **Sound Escaping**: μουσικά escape rooms για ομάδες 5 ατόμων (endgame, όχι MVP).
- **Καλλιτέχνες**: SoundCloud-λογική (uploads, live studio, merch table, βανάκια promotion).
- **AI Butler**: ο βοηθός του σπιτιού — υποδέχεται επισκέπτες, στήνει το vibe του δωματίου.

## 6. Αρχιτεκτονική (μην την αλλάξεις χωρίς συζήτηση)

- **Musicbond HQ (αυτό το repo)**: React + Vite + Supabase. Web, ελαφρύ, το «διαβατήριο».
- **Musicverse Experience (μέλλον)**: 3D κόσμος (Unity) που διαβάζει το ΙΔΙΟ Supabase.
- Η βάση (profiles, DNA, districts) είναι το κοινό θεμέλιο — κάθε schema αλλαγή πρέπει
  να δουλεύει και για τα δύο.
- Editorial περιεχόμενο (districts, ιστορικά άρθρα, POIs): αργότερα πιθανό Sanity CMS.

## 7. DO / DON'T για AI assistants

**DO**
- Χρησιμοποίησε τα CSS tokens (`var(--paper)`, `var(--ink)`, `var(--accent-*)`
  κ.λπ.) και τα utilities (`.comic-panel`, `.speech-bubble`, `.sfx`, `.taped`)
  — ΠΟΤΕ hardcoded hex σε inline styles
- Γράψε microcopy με λιτή, dry φωνή: «Profile saved.» αντί «POW! Vibe saved!!»
- Κράτα την ελληνική γλώσσα στο UI όπου υπάρχει ήδη
- Σκέψου κάθε νέο στοιχείο ως κολλημένο φλυερ σε πίνακα ανακοινώσεων

**DON'T**
- ΜΗΝ βάζεις speech bubbles με comic tail, ονοματοποιίες (POW!/BOOM!),
  Comic Sans/Bangers, ή cartoon mascots
- ΜΗΝ βάζεις gradients, glassmorphism, blur shadows, rounded-2xl minimal look
- ΜΗΝ βάζεις γενικά UI kits (Material, Bootstrap look)
- ΜΗΝ βάζεις φωτεινά/neon primary-color παλέτα — η παλέτα είναι πάντα ξεθωριασμένη/muted
- ΜΗΝ προσθέτεις dark mode χωρίς να ζητηθεί (το «χαρτί» είναι η ταυτότητα)
- ΜΗΝ κάνεις import από το `src/_legacy/`
- ΜΗΝ εκθέτεις πραγματική τοποθεσία χρήστη στον χάρτη

---

*Αν κάτι δεν καλύπτεται εδώ, ρώτα τον Ξεϊροκάμωτο πριν αυτοσχεδιάσεις.*
