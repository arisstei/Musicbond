import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

// Παλέτα για χρωματισμό ονομάτων χρηστών στο chat (ίδιο πνεύμα με
// το Music DNA — μουντά, όχι neon χρώματα).
const USER_COLORS = [
  'var(--accent-red)',
  'var(--accent-pink)',
  'var(--accent-orange)',
  'var(--accent-teal)',
  'var(--accent-violet)',
  'var(--accent-mustard)',
]

function colorForUser(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return USER_COLORS[hash % USER_COLORS.length]
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })
}

export function ChatWindow({ channel, story, userId, username }) {
  const isStory = channel.kind === 'story'
  const displayName = isStory ? story?.title || channel.topic || channel.name : channel.name

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  // Πόσα μηνύματα φορτώθηκαν αρχικά — όσα έρχονται μετά παίρνουν το
  // "αυτοκόλλητο" animation, τα παλιά απλώς εμφανίζονται ήπια.
  const [initialCount, setInitialCount] = useState(0)
  const [stamped, setStamped] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    supabase
      .from('messages')
      .select('*')
      .eq('channel_id', channel.id)
      .order('created_at', { ascending: true })
      .limit(200)
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error) {
          setMessages(data ?? [])
          setInitialCount(data?.length ?? 0)
        }
        setLoading(false)
      })

    // Μοναδικό topic ανά subscription: αν το ίδιο κανάλι ξαναστηθεί αμέσως
    // (React StrictMode, γρήγορη εναλλαγή καναλιών), το supabase-js θα
    // επέστρεφε αλλιώς το παλιό channel που κλείνει — και δεν θα έφτανε τίποτα.
    const sub = supabase
      .channel(`messages:${channel.id}:${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channel.id}` },
        (payload) => {
          setMessages((prev) => (prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new]))
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(sub)
    }
  }, [channel.id])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    const content = text.trim()
    if (!content) return
    setText('')
    setStamped(true)
    setTimeout(() => setStamped(false), 300)

    const { data, error } = await supabase
      .from('messages')
      .insert({ channel_id: channel.id, user_id: userId, username, content })
      .select()
      .single()

    if (error) {
      console.error('Send failed:', error.message)
      setText(content) // ξαναβάλε το κείμενο ώστε να μη χαθεί
      return
    }

    // Ο αποστολέας βλέπει το μήνυμά του αμέσως· όταν έρθει και το realtime
    // event με το ίδιο id, αγνοείται (dedupe στο handler).
    setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]))
  }

  return (
    <div className="chat-main page-turn">
      <div className="chat-header">
        {isStory ? (
          <>
            <p className="chat-header-kicker">Νήμα τραγουδιού · Ταξίδι στη Μουσική</p>
            <h2>♪ {displayName}</h2>
            {story?.teaser && <p>{story.teaser}</p>}
            {channel.story_url && (
              <a className="story-link" href={channel.story_url} target="_blank" rel="noreferrer">
                Διάβασε την ιστορία →
              </a>
            )}
          </>
        ) : (
          <>
            <h2># {channel.name}</h2>
            {channel.topic && <p>{channel.topic}</p>}
          </>
        )}
        <div className="ticker" aria-hidden="true">
          <span className="ticker-track">
            <span className="ticker-live">● LIVE</span>
            {` · ${isStory ? displayName : '#' + channel.name} · ${messages.length} μηνύματα · Musicbond — η κοινότητα για μουσικούς · Ηράκλειο · Cult 80—90—00 · `}
            <span className="ticker-live">● LIVE</span>
            {` · ${story?.composer ? 'Μουσική: ' + story.composer + ' · ' : ''}${channel.topic ?? ''}`}
          </span>
        </div>
      </div>

      <div className="chat-scroll" ref={scrollRef}>
        {loading && <p className="chat-empty vhs-loading">▶ Play</p>}
        {!loading && messages.length === 0 && (
          <p className="chat-empty">Κανένα μήνυμα ακόμα — γράψε το πρώτο.</p>
        )}
        {messages.map((m, i) => (
          <div
            className={`chat-row${i >= initialCount ? ' is-new' : ''}`}
            key={m.id}
            style={i < initialCount ? { animationDelay: `${Math.min(initialCount - i, 12) * -0.02}s` } : undefined}
          >
            <div className="chat-row-head">
              <span className="chat-row-user" style={{ color: colorForUser(m.username) }}>
                {m.username}
              </span>
              <span className="chat-row-time">{formatTime(m.created_at)}</span>
            </div>
            <div className="chat-row-body">{m.content}</div>
          </div>
        ))}
      </div>

      <form className="chat-input-bar" onSubmit={handleSend}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isStory ? `Τι σκέφτεσαι για το «${displayName}»;` : `Γράψε στο #${channel.name}...`}
          maxLength={2000}
        />
        <button type="submit" className={`stamp-btn${stamped ? ' stamped' : ''}`} disabled={!text.trim()}>
          Στείλε
        </button>
      </form>
    </div>
  )
}
