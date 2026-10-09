import { useState } from 'react'
import { Hero } from './landing/Hero'
import { FeaturesGrid } from './landing/FeaturesGrid'
import { MapSection } from './landing/MapSection'
import { MusicDNACard } from './profiles/MusicDNACard'
import { SignupModal } from './profiles/SignupModal'

const FEATURES = [
  {
    title: 'Music DNA',
    subtitle: 'Μουσικό DNA',
    description: 'Your unique music identity visualized.',
  },
  {
    title: 'Explore Districts',
    subtitle: 'Εξερεύνηση',
    description: 'Navigate the comic city of sounds.',
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
    subtitle: 'Συνομιλία',
    description: 'Discord-style music sharing.',
  },
  {
    title: 'Virtual Busking',
    subtitle: 'Πλανόδιοι',
    description: 'Play for the city streets online.',
  },
]

export function MusicbondPage({
  username,
  musicDNA,
  onUsernameChange,
  onMusicDNAChange,
  onSubmitProfile,
  saving,
  message,
  profiles,
  profilesLoading,
  profilesError,
}) {
  const [signupOpen, setSignupOpen] = useState(false)

  const pageStyle = {
    minHeight: '100vh',
    padding: '40px 28px 60px',
    background: '#fff7dd',
    backgroundImage: 'radial-gradient(#ffe9a9 1px, transparent 1px)',
    backgroundSize: '16px 16px',
    color: '#111',
    fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif',
  }

  const handleJoinNow = () => {
    setSignupOpen(true)
  }

  const handleExploreDistricts = () => {
    const el = document.getElementById('map-section')
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleCloseSignup = () => {
    setSignupOpen(false)
  }

  const handleModalSubmit = async (e) => {
    await onSubmitProfile(e)
    setSignupOpen(false)
  }

  return (
    <div style={pageStyle}>
      <Hero
        onJoinNow={handleJoinNow}
        onSignIn={() => {}}
        onExploreDistricts={handleExploreDistricts}
      />
      <main>
        <FeaturesGrid features={FEATURES} />
        <MapSection />
        <MusicDNACard
          username={username}
          musicDNA={musicDNA}
          onUsernameChange={onUsernameChange}
          onMusicDNAChange={onMusicDNAChange}
          onSubmit={onSubmitProfile}
          loading={saving}
          message={message}
          profiles={profiles}
          profilesLoading={profilesLoading}
          profilesError={profilesError}
        />
      </main>

      <SignupModal
        open={signupOpen}
        onClose={handleCloseSignup}
        username={username}
        musicDNA={musicDNA}
        onUsernameChange={onUsernameChange}
        onMusicDNAChange={onMusicDNAChange}
        onSubmit={handleModalSubmit}
        loading={saving}
      />
    </div>
  )
}

