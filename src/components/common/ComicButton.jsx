export function ComicButton({
  children,
  variant = 'yellow',
  style,
  ...props
}) {
  const base = {
    padding: '11px 24px',
    border: 'var(--line)',
    borderRadius: 'var(--radius-panel)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: '0.95em',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    boxShadow: 'var(--shadow-flat-sm)',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    transition: 'transform 0.08s, box-shadow 0.08s',
    opacity: props.disabled ? 0.6 : 1,
    userSelect: 'none',
  }

  const variants = {
    yellow: {
      background: 'var(--accent-mustard)',
      color: 'var(--paper-white)',
    },
    pink: {
      background: 'var(--accent-pink)',
      color: 'var(--paper-white)',
    },
    secondary: {
      background: 'var(--paper-white)',
      color: 'var(--ink)',
    },
  }

  return (
    <button
      {...props}
      style={{
        ...base,
        ...(variants[variant] ?? variants.yellow),
        ...style,
      }}
    >
      {children}
    </button>
  )
}
