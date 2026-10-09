import Link from "next/link";
import { GradeBadge } from "@/components/GradeBadge";
import DiamondDivider from "@/components/DiamondDivider";
import { getDictionary } from "@/lib/dictionaries";

// Διεύθυνση του Musicbond. Όσο δεν έχει οριστεί (env var στο Vercel), το
// κουμπί συζήτησης απλά δεν εμφανίζεται — το site δουλεύει όπως πριν.
const MUSICBOND_URL = process.env.NEXT_PUBLIC_MUSICBOND_URL;

function toEmbedUrl(url) {
  if (!url) return null;
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  const id = (watchMatch && watchMatch[1]) || (shortMatch && shortMatch[1]);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

function VideoEmbed({ url, label }) {
  const embedUrl = toEmbedUrl(url);
  if (!embedUrl) return null;
  return (
    <div className="mt-3">
      <div className="aspect-video rounded-lg overflow-hidden border border-black/10 bg-black/5">
        <iframe
          src={embedUrl}
          title={label || "YouTube video"}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {label && <p className="text-xs text-ink/50 mt-1.5">{label}</p>}
    </div>
  );
}

function PerformanceCard({ heading, performance, t }) {
  if (!performance) return null;
  const { performer, year, note, videoUrl, videoLabel, sourceLabel, sourceUrl } =
    performance;
  return (
    <div className="border border-black/10 rounded-lg p-4 bg-white/60">
      <h3 className="text-sm font-medium text-ink/50 uppercase tracking-wide mb-1.5">
        {heading}
      </h3>
      {performer && (
        <p className="text-ink font-medium">
          {performer}
          {year ? <span className="text-ink/50 font-normal"> · {year}</span> : ""}
        </p>
      )}
      {note && <p className="text-ink/70 text-sm mt-1.5 leading-relaxed">{note}</p>}
      <VideoEmbed url={videoUrl} label={videoLabel} />
      {!videoUrl && sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-2 text-xs text-brand hover:underline"
        >
          {t.sourceLabel} {sourceLabel || sourceUrl} →
        </a>
      )}
    </div>
  );
}

// Κοινό component άρθρου τραγουδιού — χρησιμοποιείται και από την Ελληνική
// και από την Αγγλική σελίδα. Το `song` πρέπει να είναι ήδη localized
// (βλ. lib/songs.js -> localizeSong) και το `lang` καθορίζει το λεξικό.
export default function SongArticle({ song, lang = "el" }) {
  const t = getDictionary(lang);
  const basePath = lang === "en" ? "/en" : "";

  const credits = [song.composer, song.lyricist]
    .filter((v, i, arr) => v && arr.indexOf(v) === i)
    .join(" / ");

  return (
    <article>
      <Link href={`${basePath}/`} className="text-sm text-brand hover:underline">
        {t.backToAll}
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="font-serif font-bold uppercase tracking-tight text-3xl sm:text-4xl text-ink leading-tight">
          {song.title}
        </h1>
        <p className="text-ink/60 mt-2">
          {credits}
          {song.year ? ` · ${song.year}` : ""}
          {song.performer ? ` · ${t.performerLabel} ${song.performer}` : ""}
        </p>
        {song.film && (
          <p className="text-ink/50 text-sm mt-1">
            {t.filmLabel} {song.film}
          </p>
        )}
        <div className="mt-4">
          <GradeBadge song={song} lang={lang} />
        </div>
        <DiamondDivider className="mt-6" />
      </header>

      {song.historicalPhoto && (
        <div className="torn-bottom group mb-10 relative overflow-hidden border border-gold/30 bg-gradient-to-br from-gold-light/70 via-cream to-brand-light/30 p-6 sm:p-8 -rotate-[0.4deg] hover:rotate-0 transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:border-gold/60">
          <span aria-hidden="true" className="washi-tape right-10 rotate-[5deg]" />
          <div className="bg-dotted absolute inset-0 opacity-40 pointer-events-none" />
          <div className="relative flex items-start gap-4 sm:gap-5">
            <div className="shrink-0 w-12 h-12 rounded-full bg-white/90 border border-gold/40 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-gold">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-gold"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2.5" y="6" width="19" height="14" rx="2" />
                <path d="M8 6l1.6-2.4A1.5 1.5 0 0 1 10.85 3h2.3a1.5 1.5 0 0 1 1.25.6L15.7 6" />
                <circle cx="12" cy="13" r="3.4" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[11px] font-semibold text-gold uppercase tracking-[0.22em] mb-2">
                {t.historicalPhotoLabel}
              </p>
              <p className="font-serif italic text-ink/85 leading-relaxed">
                {song.historicalPhoto.caption}
              </p>
              {song.historicalPhoto.sourceUrl && (
                <a
                  href={song.historicalPhoto.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold uppercase tracking-wide px-4 py-2 rounded-full border border-gold text-gold transition-all duration-200 hover:bg-gold hover:text-white hover:shadow-md hover:-translate-y-0.5 hover:gap-2.5"
                >
                  {song.historicalPhoto.sourceLabel || t.seeSource}
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="prose-like space-y-5">
        {song.story.map((p, i) => (
          <p key={i} className="text-ink/85 leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      {song.quote && (
        <blockquote className="mt-8 border-l-4 border-brand pl-5 py-1 italic text-ink/90">
          «{song.quote}»
          {song.quoteAttribution && (
            <footer className="not-italic text-sm text-ink/50 mt-2">
              — {song.quoteAttribution}
            </footer>
          )}
        </blockquote>
      )}

      {song.quoteReply && (
        <blockquote className="mt-4 border-l-4 border-brand/40 pl-5 py-1 italic text-ink/90">
          «{song.quoteReply}»
          {song.quoteReplyAttribution && (
            <footer className="not-italic text-sm text-ink/50 mt-2">
              — {song.quoteReplyAttribution}
            </footer>
          )}
        </blockquote>
      )}

      {song.caveat && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
          <strong>{t.caveatLabel}</strong> {song.caveat}
        </div>
      )}

      {(song.firstPerformance || song.famousPerformance) && (
        <section className="mt-10">
          <h2 className="font-serif text-lg text-ink mb-3">{t.performancesHeading}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <PerformanceCard
              heading={t.firstPerformance}
              performance={song.firstPerformance}
              t={t}
            />
            {song.famousPerformance && !song.famousPerformance.sameAsFirst && (
              <PerformanceCard
                heading={t.famousPerformance}
                performance={song.famousPerformance}
                t={t}
              />
            )}
          </div>
          {song.famousPerformance?.sameAsFirst && song.famousPerformance.note && (
            <p className="text-sm text-ink/60 mt-3 italic">
              {song.famousPerformance.note}
            </p>
          )}
        </section>
      )}

      {song.interviewVideo && (
        <section className="mt-10">
          <h2 className="font-serif text-lg text-ink mb-3">{t.interviewHeading}</h2>
          <VideoEmbed url={song.interviewVideo.url} label={song.interviewVideo.label} />
        </section>
      )}

      {song.coverVideoUrl && (
        <div className="mt-10">
          <h2 className="font-serif text-lg text-ink mb-3">{t.coverHeading}</h2>
          <a
            href={song.coverVideoUrl}
            className="text-brand hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {t.watchVideo}
          </a>
        </div>
      )}

      {MUSICBOND_URL && (
        <section className="mt-12 border border-brand/30 rounded-lg p-5 bg-white/60">
          <h2 className="font-serif text-lg text-ink mb-2">{t.discuss.heading}</h2>
          <p className="text-ink/70 text-sm leading-relaxed">{t.discuss.text}</p>
          <a
            href={`${MUSICBOND_URL.replace(/\/$/, "")}/?story=${encodeURIComponent(song.slug)}`}
            className="inline-block mt-3 text-sm font-semibold px-4 py-2 rounded-full border border-brand text-brand transition-all duration-200 hover:bg-brand hover:text-white"
          >
            {t.discuss.cta}
          </a>
        </section>
      )}

      {/* Πηγές — κάθε ισχυρισμός εδώ έχει δείξιμη, συνδεδεμένη πηγή.
          Κανόνας του site: καμία πληροφορία χωρίς αναφορά στο αρχικό site/δημιουργό. */}
      <section className="mt-12 pt-6 border-t border-black/10">
        <h2 className="font-serif text-lg text-ink mb-3">{t.sourcesHeading}</h2>
        <ul className="space-y-2">
          {song.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="text-brand hover:underline text-sm"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
