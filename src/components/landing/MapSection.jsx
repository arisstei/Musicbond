import { useState } from 'react'
import { ComicCard } from '../common/ComicCard'
import { ComicModal } from '../common/ComicModal'
import { ComicButton } from '../common/ComicButton'

export function MapSection() {
  const [bassModalOpen, setBassModalOpen] = useState(false)

  const sectionStyle = {
    maxWidth: 980,
    margin: '0 auto 56px',
  }

  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.7em',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'var(--accent-mustard)',
    textShadow: '-3px 3px 0 var(--ink)',
    marginBottom: 16,
  }

  const subtitleStyle = {
    fontWeight: 600,
    fontSize: '0.95em',
    color: 'var(--ink-soft)',
    marginBottom: 18,
  }

  const mapWrapper = {
    position: 'relative',
    height: 360,
    borderRadius: 'var(--radius-panel)',
    overflow: 'hidden',
    border: 'var(--line)',
  }

  const mapBackground = {
    position: 'absolute',
    inset: 0,
    backgroundImage: "url('/heraklion-city.gif')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'saturate(0.85) sepia(0.15)',
  }

  const markerWrapper = {
    position: 'absolute',
    left: '52%',
    top: '46%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  }

  const markerDot = {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'var(--accent-red)',
    border: 'var(--line)',
    boxShadow: 'var(--shadow-flat-sm)',
    cursor: 'pointer',
  }

  const bubble = {
    padding: '9px 13px',
    background: 'var(--paper-white)',
    border: 'var(--line)',
    borderRadius: 'var(--radius-bubble)',
    boxShadow: 'var(--shadow-flat-sm)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: '0.8em',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    color: 'var(--ink)',
    whiteSpace: 'nowrap',
    transform: 'translateY(-40%)',
  }

  const bubbleTail = {
    position: 'absolute',
    left: 6,
    top: '50%',
    width: 12,
    height: 12,
    background: 'var(--paper-white)',
    borderLeft: 'var(--line)',
    borderBottom: 'var(--line)',
    transform: 'translateY(-10%) rotate(45deg)',
  }

  const markerContainer = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  }

  const bassMarkerWrapper = {
    position: 'absolute',
    left: '76%',
    top: '62%',
    transform: 'translate(-50%, -50%)',
  }

  const bassMarkerDot = {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'var(--accent-teal)',
    border: 'var(--line)',
    boxShadow: 'var(--shadow-flat-sm)',
    cursor: 'pointer',
  }

  const bassLabel = {
    marginTop: 6,
    padding: '4px 8px',
    background: 'var(--paper-white)',
    border: 'var(--line)',
    borderRadius: 'var(--radius-panel)',
    boxShadow: 'var(--shadow-flat-sm)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: '0.75em',
    whiteSpace: 'nowrap',
  }

  const modalText = {
    fontWeight: 600,
    fontSize: '0.98em',
    color: 'var(--ink)',
    marginBottom: 18,
  }

  const modalActions = {
    display: 'flex',
    justifyContent: 'flex-end',
  }

  return (
    <section id="map-section" style={sectionStyle}>
      <ComicCard>
        <h2 style={titleStyle}>Explore Districts</h2>
        <p style={subtitleStyle}>
          Μια πρώτη ματιά στον χάρτη του Ηρακλείου. Περισσότερα districts
          και missions έρχονται πολύ σύντομα.
        </p>

        <div style={mapWrapper}>
          <div style={mapBackground} />
          <div style={markerWrapper}>
            <div style={markerContainer} className="lions-marker">
              <div style={markerDot} />
              <div className="lions-marker-bubble" style={bubble}>
                LIVE JAM AT LIONS SQUARE
                <span style={bubbleTail} />
              </div>
            </div>
          </div>

          <div style={bassMarkerWrapper}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setBassModalOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setBassModalOpen(true)
                }
              }}
              style={{ textAlign: 'center' }}
            >
              <div style={bassMarkerDot} />
              <div style={bassLabel}>The Bass Port</div>
            </div>
          </div>
        </div>
      </ComicCard>

      <ComicModal
        open={bassModalOpen}
        title="The Bass Port"
        onClose={() => setBassModalOpen(false)}
      >
        <p style={modalText}>
          Welcome to the Bass Port. Active Listeners: 1
        </p>
        <div style={modalActions}>
          <a
            href="https://musicbond.app/download"
            target="_blank"
            rel="noreferrer"
          >
            <ComicButton type="button" variant="pink">
              Dive into the 3D Experience
            </ComicButton>
          </a>
        </div>
      </ComicModal>
    </section>
  )
}

