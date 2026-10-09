export function ChannelSidebar({
  channels,
  stories,
  storyChannels,
  activeChannelId,
  onSelect,
  onOpenStory,
  storyError,
  username,
  onLogout,
}) {
  // Ιστορίες από το feed του site. Αν το feed δεν είναι διαθέσιμο, δείχνουμε
  // τουλάχιστον τα νήματα που υπάρχουν ήδη στη βάση.
  const storyItems =
    stories.length > 0
      ? stories
      : storyChannels.map((c) => ({ slug: c.story_slug, title: c.topic }))

  const activeStorySlug = storyChannels.find((c) => c.id === activeChannelId)?.story_slug

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <span className="vinyl" aria-hidden="true" />
          <h1 className="glitch" data-text="Musicbond">Musicbond</h1>
        </div>
        <div className="eq" aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span />
        </div>
      </div>

      <nav className="channel-list">
        <p className="sidebar-section">Κανάλια</p>
        {channels.map((ch) => (
          <button
            key={ch.id}
            className={`channel-tab${ch.id === activeChannelId ? ' active' : ''}`}
            onClick={() => onSelect(ch.id)}
          >
            # {ch.name}
          </button>
        ))}

        {storyItems.length > 0 && (
          <>
            <p className="sidebar-section">Ιστορίες τραγουδιών</p>
            {storyItems.map((s) => (
              <button
                key={s.slug}
                className={`channel-tab story-tab${s.slug === activeStorySlug ? ' active' : ''}`}
                onClick={() => onOpenStory(s)}
                title={s.teaser || s.title}
              >
                ♪ {s.title}
              </button>
            ))}
          </>
        )}

        {storyError && <p className="sidebar-error">Δεν άνοιξε το νήμα: {storyError}</p>}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-username">{username}</span>
        <button
          onClick={onLogout}
          style={{
            border: 'var(--line)',
            borderRadius: 'var(--radius-panel)',
            background: 'var(--paper-white)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75em',
            fontWeight: 700,
            padding: '6px 10px',
            boxShadow: 'var(--shadow-flat-sm)',
          }}
        >
          Έξοδος
        </button>
      </div>
    </aside>
  )
}
