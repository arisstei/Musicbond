// Φωτοτυπημένο flyer/κάρτα — βλ. DESIGN_BIBLE.md.
// Αντικαθιστά εννοιολογικά το ComicCard: ίδια design tokens,
// χωρίς "comic" ταυτότητα στο naming.
export function Panel({ children, style, taped = false, tilt, ...props }) {
  const tiltClass = tilt === 'left' ? 'tilt-left' : tilt === 'right' ? 'tilt-right' : ''
  const className = [taped ? 'taped' : '', tiltClass].filter(Boolean).join(' ') || undefined

  return (
    <div
      {...props}
      className={className}
      style={{
        background: 'var(--paper-white)',
        border: 'var(--line-bold)',
        borderRadius: 'var(--radius-panel)',
        boxShadow: 'var(--shadow-flat)',
        padding: 24,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
