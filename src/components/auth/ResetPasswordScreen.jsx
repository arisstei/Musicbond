import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Panel } from '../ui/Panel'
import { Button } from '../ui/Button'
import { PasswordField } from './PasswordField'

// Εμφανίζεται όταν ο χρήστης έρχεται από το link «επαναφορά κωδικού» του email.
export function ResetPasswordScreen({ onDone }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) setError(error.message)
    else onDone()
  }

  return (
    <div style={page}>
      <div className="slap-in" style={{ maxWidth: 420, width: '100%' }}>
        <Panel taped tilt="left" style={{ width: '100%' }}>
          <h1 style={title}>Νέος κωδικός</h1>
          <p style={subtitle}>Διάλεξε τον νέο σου κωδικό (τουλάχιστον 6 χαρακτήρες).</p>
          <form onSubmit={handleSubmit} autoComplete="off">
            <label htmlFor="new-password" style={label}>Νέος κωδικός</label>
            <PasswordField
              id="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              style={input}
            />
            <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
              {loading ? 'Αποθήκευση...' : 'Αποθήκευση κωδικού'}
            </Button>
          </form>
          {error && <div style={errorStyle}>{error}</div>}
        </Panel>
      </div>
    </div>
  )
}

const page = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }

const title = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: '1.6em',
  letterSpacing: '0.15em',
  color: 'var(--gold-bright, var(--accent-mustard))',
  textTransform: 'uppercase',
  margin: '0 0 6px',
}

const subtitle = { fontWeight: 600, fontSize: '0.95em', color: 'var(--ink-soft)', marginBottom: 18 }

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
