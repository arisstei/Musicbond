import { ComicButton } from '../common/ComicButton'

export function Hero({ customTitle, customSubtitle, onJoinNow, onSignIn, onExploreDistricts }) {
  // Αν δεν δοθεί κανένα handler (π.χ. μέσα στο Dashboard), κρύβουμε τα κουμπιά login
  const showAuthButtons = Boolean(onJoinNow || onSignIn)

  // Default συμπεριφορά: scroll στον χάρτη αν δεν δοθεί handler
  const handleExplore =
    onExploreDistricts ||
    (() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' }))
  const layout = {
    maxWidth: 980,
    margin: '0 auto 56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 40,
    flexWrap: 'wrap',
  }
  const heroText = { flex: '1 1 260px' }
  const kicker = {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    border: 'var(--line)',
    background: 'var(--paper-white)',
    boxShadow: 'var(--shadow-flat-sm)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: '0.8em',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  }
  const title = {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '3em',
    letterSpacing: 1,
    color: 'var(--accent-mustard)',
    textTransform: 'uppercase',
    textShadow: '-3px 3px 0 var(--ink)',
    margin: 0,
  }
  const subtitle = {
    marginTop: 14,
    padding: '16px 20px',
    maxWidth: 420,
    background: 'var(--paper-white)',
    border: 'var(--line-bold)',
    borderRadius: 'var(--radius-panel)',
    boxShadow: 'var(--shadow-flat-lg)',
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: '1em',
    lineHeight: 1.45,
  }
  const buttonsRow = {
    marginTop: 20,
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  }

  const heroRight = {
    flex: '0 1 260px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 260,
  }
  const vinylOuter = {
    width: 250,
    height: 250,
    borderRadius: '50%',
    border: '6px solid var(--ink)',
    background: 'repeating-radial-gradient(circle at 50% 50%, #2a2a26 0px, #2a2a26 2px, #1c1a17 3px, #1c1a17 6px)',
    boxShadow: 'var(--shadow-flat-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
  const vinylLabel = {
    width: 84,
    height: 84,
    borderRadius: '50%',
    background: 'var(--accent-red)',
    border: '5px solid var(--ink)',
    boxShadow: '0 0 0 5px var(--paper-white)',
  }
  const badgeTag = {
    position: 'absolute',
    top: 6,
    right: -6,
    transform: 'rotate(-8deg)',
    background: 'var(--paper-white)',
    border: 'var(--line)',
    padding: '4px 10px',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: '0.75em',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: 'var(--shadow-flat-sm)',
  }

  return (
    <header style={layout}>
      <div style={heroText}>
        <div style={kicker}>Est. Ηράκλειο</div>
        <h1 style={title}>{customTitle || 'MUSICBOND'}</h1>
        <p style={subtitle}>
          {customSubtitle ||
            'Εξερεύνησε μια εικονική πόλη, ανακάλυψε μουσική, στήριξε καλλιτέχνες — μια underground κοινότητα που χτίζεται από το Music DNA σου.'}
        </p>
        <div style={buttonsRow}>
          {showAuthButtons && (
            <>
              <ComicButton type="button" variant="pink" onClick={onJoinNow}>
                Join now
              </ComicButton>
              <ComicButton type="button" variant="secondary" onClick={onSignIn}>
                Sign in
              </ComicButton>
            </>
          )}
          <ComicButton
            type="button"
            variant="yellow"
            onClick={handleExplore}
            style={{ whiteSpace: 'nowrap' }}
          >
            Explore districts
          </ComicButton>
        </div>
      </div>

      <div style={heroRight}>
        <div style={vinylOuter}>
          <div style={vinylLabel} />
        </div>
        <div style={badgeTag}>Members only</div>
      </div>
    </header>
  )
}
