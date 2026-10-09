import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabaseClient'
import { AuthScreen } from './components/auth/AuthScreen'
import { ResetPasswordScreen } from './components/auth/ResetPasswordScreen'
import { ProfileSetup } from './components/profile/ProfileSetup'
import { ChatApp } from './components/chat/ChatApp'

// MVP flow: Auth -> (username setup αν λείπει) -> Chat.
// Το Music DNA quiz, Dashboard, Map, κ.λπ. είναι μεταγενέστερη φάση
// (βλ. DESIGN_BIBLE.md §5) — δεν είναι στο active path πλέον.
function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recovering, setRecovering] = useState(false)
  const userIdRef = useRef(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        userIdRef.current = session.user.id
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      setSession(session)
      if (session) {
        // Refresh του token / επιστροφή στο tab ξαναστέλνουν το ίδιο session:
        // δεν ξαναφορτώνουμε (αλλιώς το ChatApp κάνει unmount και χάνεται η κατάσταση).
        if (userIdRef.current === session.user.id) return
        userIdRef.current = session.user.id
        setLoading(true)
        loadProfile(session.user.id)
      } else {
        userIdRef.current = null
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      }

      setProfile(data ?? null)
    } catch (err) {
      console.error('Unexpected error:', err)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--paper)',
          fontFamily: 'var(--font-body)',
          fontSize: '1.2em',
          fontWeight: 600,
          color: 'var(--ink-soft)',
        }}
      >
        <span className="vhs-loading">▶ Play</span>
      </div>
    )
  }

  if (!session) {
    return <AuthScreen />
  }

  if (recovering) {
    return <ResetPasswordScreen onDone={() => setRecovering(false)} />
  }

  if (!profile || !profile.username) {
    return (
      <ProfileSetup
        userId={session.user.id}
        onDone={(username) => setProfile((p) => ({ ...(p ?? {}), id: session.user.id, username }))}
      />
    )
  }

  return <ChatApp userId={session.user.id} username={profile.username} />
}

export default App
