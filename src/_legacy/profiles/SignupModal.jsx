import { ComicModal } from '../common/ComicModal'
import { MusicDNAForm } from './MusicDNAForm'

export function SignupModal({
  open,
  onClose,
  username,
  musicDNA,
  onUsernameChange,
  onMusicDNAChange,
  onSubmit,
  loading,
}) {
  const intro = {
    fontWeight: 'bold',
    fontSize: '0.95em',
    color: '#555',
    marginBottom: 18,
  }

  return (
    <ComicModal open={open} title="Join the Music Explorers" onClose={onClose}>
      <p style={intro}>
        Φτιάξε το Music DNA σου και μπες στο comic σύμπαν του Heraklion.
      </p>
      <MusicDNAForm
        username={username}
        musicDNA={musicDNA}
        onUsernameChange={onUsernameChange}
        onMusicDNAChange={onMusicDNAChange}
        onSubmit={onSubmit}
        loading={loading}
      />
    </ComicModal>
  )
}

