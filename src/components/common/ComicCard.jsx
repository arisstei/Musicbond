export function ComicCard({ children, style, taped = true, ...props }) {
  return (
    <div
      {...props}
      className={taped ? 'taped' : undefined}
      style={{
        background: 'var(--paper-white)',
        border: 'var(--line-bold)',
        borderRadius: 'var(--radius-panel)',
        boxShadow: 'var(--shadow-flat-lg)',
        padding: 32,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
