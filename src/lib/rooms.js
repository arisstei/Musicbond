import { supabase } from './supabaseClient'

// ---- Κατάλογος αντικειμένων / θεμάτων -------------------------------------

export const MAX_ITEMS = 20

export const ITEM_TYPES = {
  turntable: { label: 'Πικάπ', unique: true },
  'poster-star': { label: 'Αφίσα ★', glyph: '★' },
  'poster-note': { label: 'Αφίσα ♪', glyph: '♪' },
  'poster-peace': { label: 'Αφίσα ☮', glyph: '☮' },
  tv: { label: 'Τηλεόραση' },
  shelf: { label: 'Ράφι δίσκων' },
  lamp: { label: 'Λάμπα λάβας' },
  sofa: { label: 'Καναπές' },
  plant: { label: 'Φυτό' },
  guitar: { label: 'Κιθάρα' },
  tape: { label: 'Κασέτα' },
  keys: { label: 'Πλήκτρα' },
}

export const WALLS = [
  { id: 'stripes', label: 'Ρίγες' },
  { id: 'dots', label: 'Βούλες' },
  { id: 'plain', label: 'Απλός' },
]

export const FLOORS = [
  { id: 'wood', label: 'Ξύλο' },
  { id: 'checker', label: 'Σκακιέρα' },
  { id: 'carpet', label: 'Μοκέτα' },
]

export function defaultLayout() {
  return {
    v: 1,
    wall: 'stripes',
    floor: 'wood',
    items: [
      { id: 'shelf', type: 'shelf', x: 24, y: 48 },
      { id: 'turntable', type: 'turntable', x: 44, y: 68 },
      { id: 'tv', type: 'tv', x: 76, y: 70 },
      { id: 'lamp', type: 'lamp', x: 62, y: 66 },
      { id: 'p1', type: 'poster-star', x: 10, y: 22 },
      { id: 'p2', type: 'poster-note', x: 40, y: 26 },
      { id: 'p3', type: 'poster-peace', x: 55, y: 22 },
    ],
  }
}

// Καθαρίζει ένα layout που ήρθε από τη βάση ή το localStorage, ώστε να μην
// σπάσει το render αν λείπουν πεδία ή υπάρχουν άγνωστα αντικείμενα.
export function sanitizeLayout(raw) {
  const base = defaultLayout()
  if (!raw || typeof raw !== 'object') return base
  const wall = WALLS.some((w) => w.id === raw.wall) ? raw.wall : base.wall
  const floor = FLOORS.some((f) => f.id === raw.floor) ? raw.floor : base.floor
  const clamp = (n) => Math.min(95, Math.max(5, Number.isFinite(n) ? n : 50))
  const items = Array.isArray(raw.items)
    ? raw.items
        .filter((i) => i && ITEM_TYPES[i.type] && typeof i.id === 'string')
        .slice(0, MAX_ITEMS)
        .map((i) => ({ id: i.id.slice(0, 40), type: i.type, x: clamp(i.x), y: clamp(i.y) }))
    : base.items
  return { v: 1, wall, floor, items }
}

// ---- Σύνδεσμοι μουσικής ---------------------------------------------------

// Δέχεται link YouTube / Spotify / SoundCloud και επιστρέφει ΜΟΝΟ τη διεύθυνση
// embed που φτιάχνουμε εμείς (ποτέ το ωμό κείμενο του χρήστη στο iframe).
export function parseMusicLink(input) {
  if (typeof input !== 'string') return null
  let url
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null
  const host = url.hostname.replace(/^www\.|^m\./, '')

  if (host === 'youtube.com' || host === 'music.youtube.com') {
    const list = url.searchParams.get('list')
    const id = url.searchParams.get('v')
    if (id && /^[\w-]{11}$/.test(id)) {
      return { provider: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}`, height: 220 }
    }
    if (list && /^[\w-]{10,60}$/.test(list)) {
      return {
        provider: 'youtube',
        src: `https://www.youtube-nocookie.com/embed/videoseries?list=${list}`,
        height: 220,
      }
    }
    return null
  }
  if (host === 'youtu.be') {
    const id = url.pathname.slice(1)
    return /^[\w-]{11}$/.test(id)
      ? { provider: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}`, height: 220 }
      : null
  }
  if (host === 'open.spotify.com') {
    const m = url.pathname.match(/^\/(?:intl-[a-z]{2}\/)?(track|album|playlist|artist|episode|show)\/([A-Za-z0-9]{10,30})$/)
    return m
      ? {
          provider: 'spotify',
          src: `https://open.spotify.com/embed/${m[1]}/${m[2]}`,
          height: m[1] === 'track' || m[1] === 'episode' ? 152 : 352,
        }
      : null
  }
  if (host === 'soundcloud.com') {
    if (!/^\/[^/]+\/[^/]+/.test(url.pathname)) return null
    const clean = `https://soundcloud.com${url.pathname}`
    return {
      provider: 'soundcloud',
      src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(clean)}&visual=false`,
      height: 166,
    }
  }
  return null
}

// ---- Αποθήκευση (Supabase, με τοπικό fallback για δοκιμές) -----------------

const localKey = (userId) => `musicbond:room:${userId}`

function tableMissing(error) {
  if (!error) return false
  const text = `${error.code ?? ''} ${error.message ?? ''}`
  return /PGRST205|42P01|schema cache|does not exist/i.test(text)
}

function readLocal(userId) {
  try {
    const raw = localStorage.getItem(localKey(userId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeLocal(userId, room) {
  try {
    localStorage.setItem(localKey(userId), JSON.stringify(room))
  } catch {
    /* αγνοούμε: private mode / γεμάτο storage */
  }
}

function normalize(row) {
  return {
    userId: row.user_id,
    username: row.username,
    layout: sanitizeLayout(row.layout),
    nowPlaying: row.now_playing ?? '',
    visibility: row.visibility === 'public' ? 'public' : 'private',
  }
}

// Επιστρέφει { room, local } — local=true όταν ο πίνακας `rooms` δεν υπάρχει
// ακόμα στο Supabase και δουλεύουμε με αποθήκευση στον browser.
export async function loadRoom(userId, username) {
  const { data, error } = await supabase.from('rooms').select('*').eq('user_id', userId).maybeSingle()
  if (tableMissing(error)) {
    const saved = readLocal(userId)
    return {
      local: true,
      room: saved
        ? { ...saved, username, layout: sanitizeLayout(saved.layout) }
        : { userId, username, layout: defaultLayout(), nowPlaying: '', visibility: 'private' },
    }
  }
  if (error) throw error
  if (!data) {
    return {
      local: false,
      room: { userId, username, layout: defaultLayout(), nowPlaying: '', visibility: 'private' },
    }
  }
  // Το username στον πίνακα είναι snapshot: ανανεώνεται με το τωρινό στην επόμενη αποθήκευση.
  return { local: false, room: { ...normalize(data), username } }
}

export async function saveRoom(room, local) {
  if (local) {
    writeLocal(room.userId, room)
    return
  }
  const { error } = await supabase.from('rooms').upsert({
    user_id: room.userId,
    username: room.username,
    layout: room.layout,
    now_playing: room.nowPlaying || null,
    visibility: room.visibility,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}

export async function listPublicRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('user_id, username, now_playing, visibility, layout')
    .eq('visibility', 'public')
    .order('updated_at', { ascending: false })
    .limit(30)
  if (tableMissing(error)) return []
  if (error) throw error
  return (data ?? []).map(normalize)
}

export async function loadPublicRoom(userId) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('user_id', userId)
    .eq('visibility', 'public')
    .maybeSingle()
  if (error) throw error
  return data ? normalize(data) : null
}
