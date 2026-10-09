export function ProfilesList({ profiles, loading, error }) {
  const list = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: 12,
  }
  const item = {
    padding: 14,
    border: '4px solid #111',
    borderRadius: 14,
    background: '#f9f7f0',
    boxShadow: '4px 4px 0 #222',
  }
  const meta = {
    display: 'grid',
    gap: 6,
    color: '#222',
    fontWeight: 'bold',
    lineHeight: 1.15,
  }

  if (loading) return <div style={item}>Loading profiles...</div>
  if (error) return <div style={item}>Error: {error}</div>
  if (!profiles || profiles.length === 0) return <div style={item}>No profiles yet. Add the first one!</div>

  return (
    <ul style={list}>
      {profiles.map((p, idx) => (
        <li key={p?.id ?? `${p?.username ?? 'profile'}-${idx}`} style={item}>
          <div style={meta}>
            <div>Username: <span style={{ fontWeight: 900 }}>{p?.username ?? '—'}</span></div>
            <div>Music DNA: <span style={{ fontWeight: 900 }}>{p?.music_dna ?? '—'}</span></div>
          </div>
        </li>
      ))}
    </ul>
  )
}

