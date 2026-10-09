import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Hero } from '../landing/Hero'
import { FeaturesGrid } from '../landing/FeaturesGrid'
import { MapSection } from '../landing/MapSection'
import { ComicCard } from '../common/ComicCard'

export function Dashboard({ session }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile()
  }, [session])

  const getProfile = async () => {
    try {
      setLoading(true)
      const { user } = session

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      }
      if (data) setProfile(data)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body)',
        background: 'var(--paper)'
      }}>
        Loading your HQ...
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--paper)', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>

      <div style={{ position: 'relative' }}>
        <Hero
          customTitle={profile?.username ? `Welcome, ${profile.username}` : 'Musicbond HQ'}
        />

        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'var(--accent-red)',
            color: 'var(--paper-white)',
            border: 'var(--line)',
            borderRadius: 'var(--radius-panel)',
            padding: '8px 16px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            letterSpacing: '0.5px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-flat-sm)',
            zIndex: 100
          }}
        >
          LOG OUT
        </button>
      </div>

      <div style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        gap: '20px',
        backgroundColor: profile?.current_color || 'var(--paper-white)',
        borderBottom: 'var(--line-bold)'
      }}>

        <ComicCard taped={false} style={{ flex: '1 1 250px', maxWidth: '400px', transform: 'rotate(-1deg)' }}>
          <h3 style={{ margin: '0 0 10px 0', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid var(--paper-dot)', paddingBottom: 8 }}>My Sonic DNA</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <div style={{
              width: 38,
              height: 38,
              backgroundColor: profile?.current_color,
              border: 'var(--line)',
              borderRadius: '50%',
              boxShadow: 'var(--shadow-flat-sm)'
            }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{profile?.preferences?.genre || 'Unknown'}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>{profile?.preferences?.mood} Vibes</div>
            </div>
          </div>
        </ComicCard>

        <ComicCard taped={false} style={{ flex: '1 1 250px', maxWidth: '400px', transform: 'rotate(1deg)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid var(--paper-dot)', paddingBottom: 8 }}>Current Location</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.4rem' }}>📍</span>
                <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>
                    {profile?.current_district || 'Roaming Free'}
                </span>
            </div>
        </ComicCard>
      </div>

      <div style={{ padding: '40px 20px' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem', textTransform: 'uppercase', marginBottom: '30px', color: 'var(--accent-mustard)', textShadow: '-2px 2px 0 var(--ink)' }}>
            Your Tools
        </h2>
        <FeaturesGrid />
      </div>

      <div id="map-section" style={{ borderTop: '4px solid black' }}>
        <MapSection />
      </div>

    </div>
  )
}