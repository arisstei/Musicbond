import { ComicButton } from '../common/ComicButton'

export function MusicDNAForm({
  username,
  musicDNA,
  onUsernameChange,
  onMusicDNAChange,
  onSubmit,
  loading,
}) {
  const label = {
    fontWeight: 'bold',
    color: '#222',
    fontSize: '1.1em',
    marginBottom: 6,
    display: 'block',
    textShadow: '2px 2px 0 #fbd700',
  }
  const input = {
    width: '100%',
    padding: '10px',
    border: '3px solid #222',
    borderRadius: 7,
    fontSize: '1em',
    marginBottom: 16,
    outline: 'none',
    backgroundColor: '#f9f7f0',
    boxShadow: '2px 2px 0 #fbd700',
  }

  return (
    <form onSubmit={onSubmit} autoComplete="off">
      <label htmlFor="username" style={label}>Username</label>
      <input
        id="username"
        type="text"
        style={input}
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        placeholder="e.g. john123"
        required
      />

      <label htmlFor="musicDNA" style={label}>Music DNA</label>
      <input
        id="musicDNA"
        type="text"
        style={input}
        value={musicDNA}
        onChange={(e) => onMusicDNAChange(e.target.value)}
        placeholder="e.g. Rock-Blue"
        required
      />

      <ComicButton type="submit" variant="yellow" disabled={loading}>
        {loading ? 'Saving...' : 'Submit'}
      </ComicButton>
    </form>
  )
}

