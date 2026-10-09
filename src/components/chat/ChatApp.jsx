import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { fetchStories, openStoryChannel, takePendingStory } from '../../lib/stories'
import { ChannelSidebar } from './ChannelSidebar'
import { ChatWindow } from './ChatWindow'

export function ChatApp({ userId, username }) {
  const [channels, setChannels] = useState([])
  const [stories, setStories] = useState([])
  const [activeChannelId, setActiveChannelId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [storyError, setStoryError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [{ data, error }, storyList] = await Promise.all([
        supabase.from('channels').select('*').order('position', { ascending: true }),
        fetchStories(),
      ])
      if (cancelled) return

      if (error) {
        setLoadError(error.message)
        setLoading(false)
        return
      }

      let list = data ?? []
      let activeId = list.find((c) => c.kind !== 'story')?.id ?? list[0]?.id ?? null

      // Ήρθε από το κουμπί «Συζήτησέ το» του site → άνοιξε κατευθείαν το νήμα
      const pendingSlug = takePendingStory()
      if (pendingSlug) {
        try {
          const story = storyList.find((s) => s.slug === pendingSlug)
          const ch = await openStoryChannel(pendingSlug, story)
          if (cancelled) return
          if (!list.some((c) => c.id === ch.id)) list = [...list, ch]
          activeId = ch.id
        } catch (err) {
          setStoryError(err.message)
        }
      }

      setChannels(list)
      setStories(storyList)
      setActiveChannelId(activeId)
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleOpenStory = async (story) => {
    setStoryError(null)
    const existing = channels.find((c) => c.story_slug === story.slug)
    if (existing) {
      setActiveChannelId(existing.id)
      return
    }
    try {
      const ch = await openStoryChannel(story.slug, story)
      setChannels((prev) => (prev.some((c) => c.id === ch.id) ? prev : [...prev, ch]))
      setActiveChannelId(ch.id)
    } catch (err) {
      setStoryError(err.message)
    }
  }

  const handleLogout = () => supabase.auth.signOut()

  if (loading) {
    return <div style={centered}>Φορτώνει τα κανάλια...</div>
  }

  if (loadError) {
    return (
      <div style={centered}>
        Δεν βρέθηκαν κανάλια. Έτρεξες το <code>sql/002_chat_mvp.sql</code> στο Supabase;
        <br />
        <span style={{ fontSize: '0.8em', color: 'var(--ink-soft)' }}>{loadError}</span>
      </div>
    )
  }

  const activeChannel = channels.find((c) => c.id === activeChannelId)
  const activeStory = activeChannel?.story_slug
    ? stories.find((s) => s.slug === activeChannel.story_slug)
    : null

  return (
    <div className="app-shell">
      <ChannelSidebar
        channels={channels.filter((c) => c.kind !== 'story')}
        stories={stories}
        storyChannels={channels.filter((c) => c.kind === 'story')}
        activeChannelId={activeChannelId}
        onSelect={setActiveChannelId}
        onOpenStory={handleOpenStory}
        storyError={storyError}
        username={username}
        onLogout={handleLogout}
      />
      {activeChannel && (
        <ChatWindow
          key={activeChannel.id}
          channel={activeChannel}
          story={activeStory}
          userId={userId}
          username={username}
        />
      )}
    </div>
  )
}

const centered = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: 24,
  fontFamily: 'var(--font-body)',
  color: 'var(--ink)',
}
