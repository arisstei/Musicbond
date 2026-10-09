// Zine/ticket-stub κουμπί — ίδια tokens με ComicButton, νέο naming.
export function Button({ children, variant = 'primary', style, ...props }) {
  const base = {
    padding: '10px 20px',
    border: 'var(--line)',
    borderRadius: 'var(--radius-panel)',
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    fontSize: '0.9em',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    boxShadow: 'var(--shadow-flat-sm)',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    transition: 'transform 0.08s, box-shadow 0.08s',
    opacity: props.disabled ? 0.6 : 1,
    userSelect: 'none',
  }

  const variants = {
    primary: { background: 'var(--accent-mustard)', color: 'var(--paper-white)' },
    accent: { background: 'var(--accent-pink)', color: 'var(--paper-white)' },
    ghost: { background: 'var(--paper-white)', color: 'var(--ink)' },
  }

  return (
    <button
      {...props}
      style={{ ...base, ...(variants[variant] ?? variants.primary), ...style }}
    >
      {children}
    </button>
  )
}
