export function ComicModal({ open, title, onClose, children }) {
  if (!open) return null

  const overlay = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(28, 26, 23, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
  }

  const modal = {
    maxWidth: 440,
    width: '90%',
    background: 'var(--paper-white)',
    border: 'var(--line-bold)',
    borderRadius: 'var(--radius-panel)',
    boxShadow: 'var(--shadow-flat-lg)',
    padding: 26,
    position: 'relative',
    fontFamily: 'var(--font-body)',
  }

  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1.4em',
    letterSpacing: '0.5px',
    margin: '0 0 10px',
    color: 'var(--ink)',
    textTransform: 'uppercase',
  }

  const closeBtn = {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 'var(--radius-panel)',
    border: 'var(--line)',
    background: 'var(--paper-white)',
    boxShadow: 'var(--shadow-flat-sm)',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: '1em',
    lineHeight: '1',
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div
        style={modal}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <button type="button" style={closeBtn} onClick={onClose}>
          ×
        </button>
        {title && <h2 style={titleStyle}>{title}</h2>}
        {children}
      </div>
    </div>
  )
}
