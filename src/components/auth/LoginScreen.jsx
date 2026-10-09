import { useState } from 'react'
// ΑΛΛΑΓΗ ΕΔΩ: Σωστή διαδρομή για το src/lib
import { supabase } from '../../lib/supabaseClient'; // ΣΩΣΤΟ (με διπλό ../../) 
import { ComicCard } from '../common/ComicCard'
import { ComicButton } from '../common/ComicButton'

export function LoginScreen() {
  const [identifier, setIdentifier] = useState('')
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

    console.log("Attempting auth with:", identifier)

    try {
      if (isSignUp) {
        // --- LOGIC ΓΙΑ ΕΓΓΡΑΦΗ (SIGN UP) ---
        const { data, error } = await supabase.auth.signUp({
          email: identifier,
          password: password,
        })

        if (error) throw error

        // Επιτυχία Εγγραφής
        console.log("Signup success:", data)
        alert("Registration Successful! Check your email to confirm your account.")
        setInfo("Check your email for the confirmation link!")
        setIsSignUp(false) // Γυρνάμε σε login mode

      } else {
        // --- LOGIC ΓΙΑ ΕΙΣΟΔΟ (LOGIN) ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password: password,
        })

        if (error) throw error

        console.log("Login success:", data)
        // Το App.jsx θα καταλάβει αυτόματα ότι συνδέθηκες
      }
    } catch (error) {
      console.error("Auth Error:", error.message)
      setError(error.message)
      alert("Error: " + error.message) 
    } finally {
      setLoading(false)
    }
  }

  // --- STYLES ---
  const page = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
    background: 'var(--paper)',
    backgroundImage: 'radial-gradient(var(--paper-dot) 1.2px, transparent 1.2px)',
    backgroundSize: '10px 10px',
    fontFamily: 'var(--font-body)',
  }

  const title = {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '2.2em',
    letterSpacing: 1,
    color: 'var(--accent-mustard)',
    textTransform: 'uppercase',
    textShadow: '-3px 3px 0 var(--ink)',
    marginBottom: 6,
  }

  const subtitle = {
    fontWeight: 600,
    fontSize: '0.98em',
    color: 'var(--ink-soft)',
    marginBottom: 18,
  }

  const label = {
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: '0.82em',
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
    background: '#f3ddd8',
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
    background: '#dcece8',
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

  return (
    <div style={page}>
      <ComicCard style={{ maxWidth: 420, width: '100%' }}>
        <h1 style={title}>Musicbond</h1>
        <p style={subtitle}>
          {isSignUp
            ? 'Register to join the musicverse.'
            : 'Sign in to enter the musicverse.'}
        </p>
        
        <form onSubmit={handleAuth} autoComplete="off">
          <label htmlFor="identifier" style={label}>Email</label>
          <input
            id="identifier"
            type="email"
            style={input}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password" style={label}>Password</label>
          <input
            id="password"
            type="password"
            style={input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6} 
          />

          <ComicButton
            type="submit"
            variant="yellow"
            disabled={loading}
            style={{ width: '100%', marginTop: 4 }}
          >
            {loading
              ? isSignUp ? 'Creating account...' : 'Signing in...'
              : isSignUp ? 'Sign up' : 'Sign in'}
          </ComicButton>
        </form>

        {error && (
          <div style={errorStyle}>{error}</div>
        )}
        {info && !error && (
          <div style={infoStyle}>{info}</div>
        )}

        <div style={toggleText}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <span
            style={toggleLink}
            onClick={() => {
              setIsSignUp((prev) => !prev)
              setError(null)
              setInfo(null)
            }}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </span>
        </div>
      </ComicCard>
    </div>
  )
}