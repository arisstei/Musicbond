import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Panel } from '../ui/Panel'
import { Button } from '../ui/Button'

// Ελάχιστο profile setup: μόνο username. Το Music DNA quiz
// (OnboardingWizard.jsx) μένει για μεταγενέστερη φάση — βλ. DESIGN_BIBLE.md §5.
export function ProfileSetup({ userId, onDone }) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = username.trim()
    if (trimmed.length < 2) {
      setError('Το username θέλει τουλάχιστον 2 χαρακτήρες.')
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      username: trimmed,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    onDone(trimmed)
  }

  return (
    <div style={page}>
      <div className="slap-in" style={{ maxWidth: 400, width: '100%' }}>
      <Panel taped tilt="right" style={{ width: '100%' }}>
        <p style={eyebrow}>Ένα ακόμα βήμα</p>
        <h1 style={title}>Πώς σε λένε;</h1>
        <p style={subtitle}>Αυτό θα βλέπουν οι άλλοι στα κανάλια.</p>

        <form onSubmit={handleSubmit}>
          <input
            style={input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="π.χ. crate_digger_92"
            maxLength={24}
            autoFocus
          />
          <Button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Αποθήκευση...' : 'Μπες στο Musicbond'}
          </Button>
        </form>

        {error && <div style={errorStyle}>{error}</div>}
      </Panel>
      </div>
    </div>
  )
}

const page = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 16px',
}

const eyebrow = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.75em',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--accent-teal)',
  marginBottom: 2,
}

const title = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: '2em',
  color: 'var(--ink)',
  margin: '0 0 6px',
}

const subtitle = {
  fontWeight: 600,
  fontSize: '0.9em',
  color: 'var(--ink-soft)',
  marginBottom: 18,
}

const input = {
  width: '100%',
  padding: '10px',
  border: 'var(--line)',
  borderRadius: 'var(--radius-panel)',
  fontSize: '1em',
  fontFamily: 'var(--font-body)',
  marginBottom: 12,
  backgroundColor: 'var(--paper-white)',
  boxShadow: 'var(--shadow-flat-sm)',
  outline: 'none',
}

const errorStyle = {
  marginTop: 10,
  padding: '8px 10px',
  borderRadius: 'var(--radius-panel)',
  border: '2px solid var(--accent-red)',
  background: 'rgba(181, 71, 58, 0.12)',
  color: 'var(--accent-red)',
  fontWeight: 600,
  fontSize: '0.85em',
  boxShadow: 'var(--shadow-flat-sm)',
}
