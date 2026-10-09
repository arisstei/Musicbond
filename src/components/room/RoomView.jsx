import { useEffect, useRef, useState } from 'react'
import {
  FLOORS,
  ITEM_TYPES,
  MAX_ITEMS,
  WALLS,
  listPublicRooms,
  loadPublicRoom,
  loadRoom,
  parseMusicLink,
  saveRoom,
} from '../../lib/rooms'
import { RoomScene } from './RoomScene'

// Προφίλ-δωμάτιο: το δωμάτιο του χρήστη (επεξεργάσιμο) ή ξένο δημόσιο δωμάτιο
// (μόνο προβολή). Το σκηνικό είναι 2D και χρησιμοποιεί μόνο τα tokens του θέματος.
export function RoomView({ userId, username, visitUserId = null, onVisit, onHome }) {
  const visiting = visitUserId && visitUserId !== userId
  const [room, setRoom] = useState(null)
  const [local, setLocal] = useState(false)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('')
  const [editing, setEditing] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [linkInput, setLinkInput] = useState('')
  const [linkError, setLinkError] = useState('')
  const [publicRooms, setPublicRooms] = useState([])
  const [dirty, setDirty] = useState(false)
  const sceneRef = useRef(null)
  const dragRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setRoom(null)
      setError(null)
      setEditing(false)
      setSelectedId(null)
      setDirty(false)
      try {
        if (visiting) {
          const r = await loadPublicRoom(visitUserId)
          if (cancelled) return
          if (!r) setError('Αυτό το δωμάτιο δεν είναι δημόσιο ή δεν υπάρχει.')
          else {
            setRoom(r)
            setLinkInput(r.nowPlaying)
          }
        } else {
          const res = await loadRoom(userId, username)
          if (cancelled) return
          setRoom(res.room)
          setLocal(res.local)
          setLinkInput(res.room.nowPlaying)
        }
        const list = await listPublicRooms()
        if (!cancelled) setPublicRooms(list.filter((r) => r.userId !== userId))
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [userId, username, visitUserId, visiting])

  // Κρατάμε την τελευταία κατάσταση σε ref για το cleanup και το beforeunload.
  const latest = useRef({ room, local, dirty, visiting })
  useEffect(() => {
    latest.current = { room, local, dirty, visiting }
  })

  // Κλείσιμο/ανανέωση καρτέλας με μη αποθηκευμένες αλλαγές: ρωτάει ο browser.
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (latest.current.dirty && !latest.current.visiting) e.preventDefault()
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  // Φεύγεις από το δωμάτιο μέσα στην εφαρμογή (κανάλι, επίσκεψη): αυτόματη αποθήκευση.
  useEffect(
    () => () => {
      const { room: r, local: l, dirty: d, visiting: v } = latest.current
      if (d && !v && r) saveRoom(r, l).catch(() => {})
    },
    [],
  )

  if (error) {
    return (
      <main className="room-page">
        <p className="room-error">{error}</p>
        <button className="room-btn" onClick={onHome}>
          ← Στο δωμάτιό μου
        </button>
      </main>
    )
  }
  if (!room) return <main className="room-page">Φορτώνει το δωμάτιο...</main>

  const layout = room.layout
  const embed = parseMusicLink(room.nowPlaying)
  const canEdit = !visiting

  const update = (patch) => {
    setRoom((r) => ({ ...r, ...patch }))
    setDirty(true)
    setStatus('')
  }
  const updateLayout = (patch) => update({ layout: { ...layout, ...patch } })

  const addItem = (type) => {
    if (layout.items.length >= MAX_ITEMS) {
      setStatus(`Το δωμάτιο γέμισε (μέγιστο ${MAX_ITEMS} αντικείμενα).`)
      return
    }
    if (ITEM_TYPES[type].unique && layout.items.some((i) => i.type === type)) {
      setStatus(`Έχεις ήδη: ${ITEM_TYPES[type].label}.`)
      return
    }
    const id = `${type}-${crypto.randomUUID().slice(0, 8)}`
    updateLayout({ items: [...layout.items, { id, type, x: 50, y: 50 }] })
    setSelectedId(id)
  }

  const removeSelected = () => {
    if (!selectedId) return
    updateLayout({ items: layout.items.filter((i) => i.id !== selectedId) })
    setSelectedId(null)
  }

  const onPointerDown = (e, item) => {
    if (!editing) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = item.id
    setSelectedId(item.id)
  }
  const onPointerMove = (e) => {
    const id = dragRef.current
    const scene = sceneRef.current
    if (!id || !scene) return
    const rect = scene.getBoundingClientRect()
    const x = Math.min(95, Math.max(5, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.min(95, Math.max(5, ((e.clientY - rect.top) / rect.height) * 100))
    setRoom((r) => ({
      ...r,
      layout: {
        ...r.layout,
        items: r.layout.items.map((i) => (i.id === id ? { ...i, x, y } : i)),
      },
    }))
    setDirty(true)
  }
  const onPointerUp = () => {
    dragRef.current = null
  }

  const applyLink = () => {
    const value = linkInput.trim()
    if (value && !parseMusicLink(value)) {
      setLinkError('Δέχομαι μόνο συνδέσμους YouTube, Spotify ή SoundCloud (https).')
      return
    }
    setLinkError('')
    update({ nowPlaying: value })
  }

  const save = async () => {
    setStatus('Αποθήκευση...')
    try {
      await saveRoom(room, local)
      setDirty(false)
      setStatus(local ? 'Αποθηκεύτηκε τοπικά στον browser.' : 'Αποθηκεύτηκε.')
    } catch (err) {
      setStatus(`Δεν αποθηκεύτηκε: ${err.message}`)
    }
  }

  const spinning = Boolean(embed)

  return (
    <main className="room-page">
      <header className="room-header">
        <h2>{visiting ? `Δωμάτιο: ${room.username}` : 'Το δωμάτιό μου'}</h2>
        {visiting ? (
          <button className="room-btn" onClick={onHome}>
            ← Το δωμάτιό μου
          </button>
        ) : (
          <div className="room-actions">
            <button className="room-btn" onClick={() => setEditing((v) => !v)}>
              {editing ? 'Τέλος επεξεργασίας' : 'Διαμόρφωση'}
            </button>
            <button className="room-btn room-btn--primary" onClick={save} disabled={!dirty}>
              Αποθήκευση
            </button>
          </div>
        )}
      </header>

      {local && canEdit && (
        <p className="room-note">
          Τοπική λειτουργία: ο πίνακας <code>rooms</code> δεν υπάρχει ακόμα στο Supabase
          (τρέξε το <code>sql/004_rooms.sql</code>). Το δωμάτιο αποθηκεύεται μόνο σε αυτόν τον
          browser και δεν μπορούν να το επισκεφτούν άλλοι.
        </p>
      )}
      {dirty && canEdit && !status && (
        <p className="room-status">Έχεις μη αποθηκευμένες αλλαγές (αποθηκεύονται αυτόματα όταν φύγεις).</p>
      )}
      {status && <p className="room-status">{status}</p>}

      <div
        ref={sceneRef}
        className={`room-scene${editing ? ' room-scene--editing' : ''}`}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <RoomScene
          layout={layout}
          playing={spinning}
          editing={editing}
          selectedId={selectedId}
          onItemPointerDown={onPointerDown}
        />
      </div>

      {canEdit && editing && (
        <section className="room-panel">
          <div className="room-row">
            <span className="room-label">Προσθήκη</span>
            {Object.entries(ITEM_TYPES).map(([type, def]) => (
              <button key={type} className="room-btn" onClick={() => addItem(type)}>
                {def.label}
              </button>
            ))}
          </div>
          <div className="room-row">
            <span className="room-label">Τοίχος</span>
            {WALLS.map((w) => (
              <button
                key={w.id}
                className={`room-btn${layout.wall === w.id ? ' is-on' : ''}`}
                onClick={() => updateLayout({ wall: w.id })}
              >
                {w.label}
              </button>
            ))}
            <span className="room-label">Πάτωμα</span>
            {FLOORS.map((f) => (
              <button
                key={f.id}
                className={`room-btn${layout.floor === f.id ? ' is-on' : ''}`}
                onClick={() => updateLayout({ floor: f.id })}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="room-row">
            <button className="room-btn" onClick={removeSelected} disabled={!selectedId}>
              Διαγραφή επιλεγμένου
            </button>
            <span className="room-hint">Σύρε τα αντικείμενα στο δωμάτιο για να τα μετακινήσεις.</span>
          </div>
          <div className="room-row">
            <span className="room-label">Ορατότητα</span>
            <button
              className={`room-btn${room.visibility === 'private' ? ' is-on' : ''}`}
              onClick={() => update({ visibility: 'private' })}
            >
              Ιδιωτικό
            </button>
            <button
              className={`room-btn${room.visibility === 'public' ? ' is-on' : ''}`}
              onClick={() => update({ visibility: 'public' })}
              disabled={local}
              title={local ? 'Χρειάζεται ο πίνακας rooms στο Supabase' : undefined}
            >
              Δημόσιο
            </button>
          </div>
          <div className="room-row">
            <span className="room-label">Στο πικάπ</span>
            <input
              className="room-input"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="Link από YouTube, Spotify ή SoundCloud"
              maxLength={500}
            />
            <button className="room-btn" onClick={applyLink}>
              Βάλε το
            </button>
          </div>
          {linkError && <p className="room-error">{linkError}</p>}
        </section>
      )}

      {embed && (
        <section className="room-player">
          <p className="room-label">♪ Παίζει στο πικάπ</p>
          <iframe
            title="Μουσική δωματίου"
            src={embed.src}
            height={embed.height}
            width="100%"
            loading="lazy"
            allow="autoplay; encrypted-media; clipboard-write"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </section>
      )}

      {publicRooms.length > 0 && (
        <section className="room-panel">
          <p className="room-label">Δημόσια δωμάτια</p>
          <div className="room-row">
            {publicRooms.map((r) => (
              <button key={r.userId} className="room-btn" onClick={() => onVisit(r.userId)}>
                {r.username}
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
