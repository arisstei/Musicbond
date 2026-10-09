const DEFAULT_FEATURES = [
  {
    title: 'Music DNA',
    subtitle: 'Μουσικό DNA',
    description: 'Your unique music identity visualized.',
  },
  {
    title: 'Explore Districts',
    subtitle: 'Εξερεύνηση',
    description: 'Navigate the city, block by block.',
  },
  {
    title: 'Historian Ranks',
    subtitle: 'Ιστορικός',
    description: 'Earn trust through music knowledge.',
  },
  {
    title: 'Rising Stars',
    subtitle: 'Ανερχόμενοι',
    description: 'Support authentic new artists.',
  },
  {
    title: 'Live Chat',
    subtitle: 'Μηνύματα',
    description: 'Talk it out, margin-note style.',
  },
  {
    title: 'Crate Digging',
    subtitle: 'Σκάψιμο',
    description: 'Discover rare hidden records.',
  },
]

export function FeaturesGrid({ features = DEFAULT_FEATURES }) {
  const section = {
    maxWidth: 980,
    margin: '0 auto 56px',
  }
  const title = {
    textAlign: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.9em',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'var(--accent-mustard)',
    textShadow: '-3px 3px 0 var(--ink)',
    marginBottom: 24,
  }
  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: 18,
  }
  const card = {
    background: 'var(--paper-white)',
    border: 'var(--line)',
    borderRadius: 'var(--radius-panel)',
    padding: 16,
    boxShadow: 'var(--shadow-flat)',
  }
  const cardTitle = {
    fontWeight: 700,
    fontSize: '1.05em',
    marginBottom: 2,
  }
  const cardSubtitle = {
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: '0.78em',
    color: 'var(--ink-soft)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
  const cardDesc = {
    margin: 0,
    fontSize: '0.9em',
    color: 'var(--ink-soft)',
  }

  return (
    <section style={section}>
      <h2 style={title}>What's Inside</h2>
      <div style={grid}>
        {(features ?? []).map((f) => (
          <article key={f.title} style={card}>
            <div style={cardTitle}>{f.title}</div>
            {f.subtitle && <div style={cardSubtitle}>{f.subtitle}</div>}
            <p style={cardDesc}>{f.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

