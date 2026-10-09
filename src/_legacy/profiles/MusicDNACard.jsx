import { ComicCard } from '../common/ComicCard'
import { MusicDNAForm } from './MusicDNAForm'
import { ProfilesList } from './ProfilesList'

export function MusicDNACard({
  username,
  musicDNA,
  onUsernameChange,
  onMusicDNAChange,
  onSubmit,
  loading,
  message,
  profiles,
  profilesLoading,
  profilesError,
}) {
  const sectionTitle = {
    marginTop: 28,
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: '1.25em',
    letterSpacing: 0.5,
    color: '#222',
    textShadow: '3px 3px 0 #fbd700',
  }

  const intro = {
    fontWeight: 'bold',
    fontSize: '0.98em',
    color: '#555',
    marginBottom: 22,
  }

  const messageStyle = (success) => ({
    marginTop: 24,
    padding: '16px',
    color: success ? '#1e7d0c' : '#b70909',
    background: success ? '#e7ffd9' : '#ffe3e3',
    border: `3px solid ${success ? '#179415' : '#b70909'}`,
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
    boxShadow: `3px 3px 0 ${success ? '#abf59f' : '#fbc1c1'}`,
  })

  const explorersCount = Array.isArray(profiles) ? profiles.length : 0
  const lastExplorerName =
    explorersCount > 0 && profiles[0]?.username
      ? profiles[0].username
      : null
  const explorersText = {
    marginTop: 8,
    marginBottom: 20,
    padding: '8px 12px',
    display: 'inline-block',
    borderRadius: 999,
    border: '3px solid #111',
    background: '#fff6b7',
    boxShadow: '3px 3px 0 #111',
    fontWeight: 'bold',
    fontSize: '0.9em',
    letterSpacing: 0.5,
  }
  const lastExplorerText = {
    marginTop: 4,
    marginBottom: 18,
    fontWeight: 'bold',
    fontSize: '0.9em',
    color: '#222',
  }

  return (
    <section id="music-dna-card" style={{ maxWidth: 420, margin: '0 auto' }}>
      <ComicCard>
        <h2 style={{ ...sectionTitle, marginTop: 0 }}>Create your Music DNA</h2>
        <p style={intro}>
          Αποθήκευσε το Music DNA σου και δες πώς ταιριάζεις με άλλους στο Musicbond.
        </p>

        {explorersCount > 0 && (
          <div style={explorersText}>
            Join {explorersCount} other Music Explorers
          </div>
        )}
        {lastExplorerName && (
          <div style={lastExplorerText}>
            Last Explorer: {lastExplorerName}
          </div>
        )}

        <MusicDNAForm
          username={username}
          musicDNA={musicDNA}
          onUsernameChange={onUsernameChange}
          onMusicDNAChange={onMusicDNAChange}
          onSubmit={onSubmit}
          loading={loading}
        />

        {message && (
          <div style={messageStyle(message.type === 'success')}>
            {message.text}
          </div>
        )}

        <h3 style={sectionTitle}>Profiles</h3>
        <ProfilesList
          profiles={profiles}
          loading={profilesLoading}
          error={profilesError}
        />
      </ComicCard>
    </section>
  )
}

