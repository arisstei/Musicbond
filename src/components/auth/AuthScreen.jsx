import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Panel } from '../ui/Panel'
import { Button } from '../ui/Button'

// Καθαρή, νέα οθόνη login/signup — retro zine στυλ (βλ. DESIGN_BIBLE.md).
// Αντικαθιστά το παλιό LoginScreen.jsx (μένει αχρησιμοποίητο στο repo).
export function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setInfo('Έλεγξε το email σου για επιβεβαίωση λογαριασμού.')
        setIsSignUp(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        // Το App.jsx αναλαμβάνει το redirect μόλις αλλάξει το session.
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={page}>
      <div className="slap-in" style={{ maxWidth: 420, width: '100%' }}>
      <Panel taped tilt="left" style={{ width: '100%' }}>
        <p style={eyebrow}>Cult 80—90—00</p>
        <div className="brand" style={{ margin: '0 0 6px' }}>
          <span className="vinyl" aria-hidden="true" style={{ width: 40, height: 40 }} />
          <h1 className="glitch" data-text="Musicbond" style={title}>Musicbond</h1>
        </div>
        <p style={subtitle}>
          {isSignUp
            ? 'Φτιάξε λογαριασμό και έλα να μιλήσουμε για μουσική.'
            : 'Μπες μέσα, η κοινότητα σε περιμένει.'}
        </p>

        <form onSubmit={handleAuth} autoComplete="off">
          <label htmlFor="email" style={label}>Email</label>
          <input
            id="email"
            type="email"
            style={input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="esy@example.com"
            required
          />

          <label htmlFor="password" style={label}>Κωδικός</label>
          <input
            id="password"
            type="password"
            style={input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            required
          />

          <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading
              ? (isSignUp ? 'Δημιουργία...' : 'Σύνδεση...')
              : (isSignUp ? 'Εγγραφή' : 'Σύνδεση')}
          </Button>
        </form>

        {error && <div style={errorStyle}>{error}</div>}
        {info && !error && <div style={infoStyle}>{info}</div>}

        <div style={toggleText}>
          {isSignUp ? 'Έχεις ήδη λογαριασμό;' : 'Δεν έχεις λογαριασμό;'}
          <span
            style={toggleLink}
            onClick={() => {
              setIsSignUp((v) => !v)
              setError(null)
              setInfo(null)
            }}
          >
            {isSignUp ? 'Σύνδεση' : 'Εγγραφή'}
          </span>
        </div>
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
  fontSize: '1.9em',
  letterSpacing: '0.2em',
  color: 'var(--gold-bright, var(--accent-mustard))',
  textTransform: 'uppercase',
  margin: '0 0 6px',
}

const subtitle = {
  fontWeight: 600,
  fontSize: '0.95em',
  color: 'var(--ink-soft)',
  marginBottom: 18,
}

const label = {
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
  fontSize: '0.8em',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  color: 'var(--ink)',
  marginBottom: 4,
  display: 'block',
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

const infoStyle = {
  marginTop: 10,
  padding: '8px 10px',
  borderRadius: 'var(--radius-panel)',
  border: '2px solid var(--accent-teal)',
  background: 'rgba(106, 163, 150, 0.12)',
  color: 'var(--accent-teal)',
  fontWeight: 600,
  fontSize: '0.85em',
  boxShadow: 'var(--shadow-flat-sm)',
}

const toggleText = {
  marginTop: 14,
  textAlign: 'center',
  fontWeight: 600,
  fontSize: '0.85em',
  color: 'var(--ink-soft)',
}

const toggleLink = {
  color: 'var(--accent-pink)',
  cursor: 'pointer',
  textDecoration: 'underline',
  marginLeft: 4,
}
