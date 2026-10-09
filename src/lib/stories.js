import { supabase } from './supabaseClient'

// Σύνδεση με το «Ταξίδι στη Μουσική» (Next.js site στο Vercel).
// Το site εκθέτει δημόσιο feed στο /api/songs με όλες τις ιστορίες.
export const STORIES_URL = (
  import.meta.env.VITE_STORIES_URL || 'https://taksidi-stin-mousiki.vercel.app'
).replace(/\/$/, '')

const PENDING_KEY = 'musicbond:pendingStory'

// Φέρνει τη λίστα ιστοριών. Αν το site δεν έχει ακόμα το /api/songs
// (ή είναι offline), επιστρέφει κενή λίστα — το chat δουλεύει κανονικά.
export async function fetchStories() {
  try {
    const res = await fetch(`${STORIES_URL}/api/songs`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data?.songs) ? data.songs : []
  } catch {
    return []
  }
}

// Ανοίγει (ή δημιουργεί την πρώτη φορά) το νήμα συζήτησης ενός τραγουδιού.
export async function openStoryChannel(slug, story) {
  const { data, error } = await supabase.rpc('get_or_create_story_channel', {
    p_slug: slug,
    p_title: story?.title ?? slug,
    p_url: story?.url ?? `${STORIES_URL}/song/${slug}`,
  })
  if (error) throw error
  return data
}

// Όταν κάποιος έρχεται από το κουμπί «Συζήτησέ το» (?story=slug) αλλά
// πρέπει πρώτα να συνδεθεί ή να επιβεβαιώσει το email του, κρατάμε το
// slug ώστε μετά το login να ανοίξει κατευθείαν το σωστό νήμα.
export function capturePendingStory() {
  try {
    const slug = new URLSearchParams(window.location.search).get('story')
    if (slug && /^[a-z0-9-]{1,80}$/.test(slug)) {
      sessionStorage.setItem(PENDING_KEY, slug)
      const url = new URL(window.location.href)
      url.searchParams.delete('story')
      window.history.replaceState({}, '', url)
    }
  } catch {
    // sessionStorage μπορεί να μην είναι διαθέσιμο — απλά το αγνοούμε
  }
}

export function takePendingStory() {
  try {
    const slug = sessionStorage.getItem(PENDING_KEY)
    if (slug) sessionStorage.removeItem(PENDING_KEY)
    return slug
  } catch {
    return null
  }
}
