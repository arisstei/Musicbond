import { useState } from 'react'

// Πεδίο κωδικού με «ματάκι» για εμφάνιση/απόκρυψη του κειμένου.
export function PasswordField({ id, value, onChange, style, autoComplete, ...rest }) {
  const [visible, setVisible] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder="••••••••"
        minLength={6}
        required
        {...rest}
        style={{ ...style, paddingRight: 44 }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Απόκρυψη κωδικού' : 'Εμφάνιση κωδικού'}
        aria-pressed={visible}
        style={eyeButton}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
          <circle cx="12" cy="12" r="3" />
          {visible && <path d="M3 3l18 18" />}
        </svg>
      </button>
    </div>
  )
}

const eyeButton = {
  position: 'absolute',
  right: 6,
  top: 0,
  height: 'calc(100% - 12px)', // ίδιο ύψος με το input (έχει marginBottom 12)
  width: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  color: 'var(--ink-soft)',
  cursor: 'pointer',
}
