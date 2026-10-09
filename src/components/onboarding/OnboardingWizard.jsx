import { useState } from 'react'
// ΠΡΟΣΟΧΗ: Εδώ έβαλα το ../../ για να το βρίσκει σωστά!
import { supabase } from '../../lib/supabaseClient' 
import { ComicCard } from '../common/ComicCard'
import { ComicButton } from '../common/ComicButton'

export function OnboardingWizard() {
  const [genre, setGenre] = useState('Rock')
  const [mood, setMood] = useState('Energetic')
  const [instrument, setInstrument] = useState('Guitar')
  const [loading, setLoading] = useState(false)

  // Συνάρτηση που διαλέγει το αρχικό χρώμα (Music DNA Color)
  const determineColor = (g, m) => {
    if (g === 'Rock') return '#b7302f' // dna-rock
    if (g === 'Jazz') return '#33588f' // dna-jazz
    if (g === 'Electronic') return '#5c8f4a' // dna-electronic
    if (g === 'Classical') return '#b9932a' // dna-classical
    if (m === 'Sad') return '#327d74' // dna-melancholic
    return '#654a92' // accent-violet default
  }

  const saveVibe = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error("No user found. Please log in again.")

      const initialColor = determineColor(genre, mood)
      
      const preferences = {
        genre,
        mood,
        instrument,
        joined_at: new Date().toISOString()
      }

      console.log("Saving vibe for user:", user.id)

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: user.email?.split('@')[0],
          current_color: initialColor,
          preferences: preferences
        })

      if (error) throw error

      alert("Profile saved. Welcome to Musicbond.")
      window.location.reload()

    } catch (error) {
      console.error('Error saving vibe:', error)
      alert('Error saving vibe: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // --- STYLES ---
  const container = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--paper)',
    backgroundImage: 'radial-gradient(var(--paper-dot) 1.2px, transparent 1.2px)',
    backgroundSize: '10px 10px',
    padding: 20
  }

  const title = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.9em',
    fontWeight: 700,
    marginBottom: 10,
    color: 'var(--accent-mustard)',
    textShadow: '-3px 3px 0 var(--ink)',
    textTransform: 'uppercase',
    letterSpacing: 1
  }

  const label = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    marginBottom: 5,
    fontSize: '0.8em',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: 'var(--ink)'
  }

  const select = {
    width: '100%',
    padding: '10px',
    border: 'var(--line)',
    borderRadius: 'var(--radius-panel)',
    fontSize: '1em',
    fontFamily: 'var(--font-body)',
    marginBottom: 15,
    backgroundColor: 'var(--paper-white)',
    boxShadow: 'var(--shadow-flat-sm)',
    outline: 'none',
    cursor: 'pointer'
  }

  return (
    <div style={container}>
      <ComicCard style={{ maxWidth: 500, width: '100%' }}>
        <h1 style={title}>Tune Your Vibe</h1>
        <p style={{ marginBottom: 20, fontWeight: 600 }}>
          Answer 3 quick questions to generate your initial Music Color.
        </p>

        <label style={label}>Favorite Genre</label>
        <select style={select} value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="Rock">Rock</option>
          <option value="Jazz">Jazz</option>
          <option value="Electronic">Electronic</option>
          <option value="Classical">Classical</option>
          <option value="Pop">Pop</option>
          <option value="Folk">Folk</option>
        </select>

        <label style={label}>Mood</label>
        <select style={select} value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="Energetic">Energetic</option>
          <option value="Chill">Chill</option>
          <option value="Melancholic">Melancholic</option>
          <option value="Focus">Focus</option>
        </select>

        <label style={label}>Instrument</label>
        <select style={select} value={instrument} onChange={(e) => setInstrument(e.target.value)}>
          <option value="Guitar">Guitar</option>
          <option value="Piano">Piano</option>
          <option value="Drums">Drums</option>
          <option value="Synthesizer">Synthesizer</option>
          <option value="Vocals">Vocals</option>
        </select>

        <ComicButton 
          variant="yellow" 
          onClick={saveVibe} 
          disabled={loading}
          style={{ width: '100%', marginTop: 10 }}
        >
          {loading ? 'Saving...' : 'Save my vibe'}
        </ComicButton>

      </ComicCard>
    </div>
  )
}