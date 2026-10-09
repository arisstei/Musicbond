// Σχέδια αντικειμένων του δωματίου (SVG, χειροποίητο στυλ).
// Κάθε σχέδιο έχει την αρχή (0,0) στο κέντρο του και μέγεθος {w,h} σε μονάδες
// του viewBox 1600x1000. Τα χρώματα έρχονται από τα --r-* tokens στο room.css.
// Οι γραμμές «βράζουν» μέσω του φίλτρου #room-boil που εφαρμόζεται στο σύνολο.

const ink = { stroke: 'var(--r-ink)', strokeWidth: 5, strokeLinejoin: 'round', strokeLinecap: 'round' }
const fill = (c, extra) => ({ fill: `var(--r-${c})`, ...extra })

// Αστεροειδής «έκρηξη μελανιού»: το σήμα της μουσικής. Σταθερό σχήμα
// (ντετερμινιστικό), ώστε να μην αλλάζει σε κάθε render.
function burstPath(spikes, inner, outer) {
  const pts = []
  for (let i = 0; i < spikes * 2; i++) {
    const a = (Math.PI * i) / spikes
    const wob = 0.78 + 0.22 * Math.abs(Math.sin(i * 12.9898))
    const r = (i % 2 === 0 ? outer : inner) * wob
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`)
  }
  return `M${pts.join('L')}Z`
}
const BURST = burstPath(14, 14, 56)

export function InkBurst({ playing, scale = 1 }) {
  return (
    <g transform={`scale(${scale})`}>
      <path d={BURST} className={`room-burst${playing ? ' is-playing' : ''}`} style={fill('ink')} />
    </g>
  )
}

export function Turntable({ playing }) {
  return (
    <g {...ink}>
      <rect x="-150" y="-10" width="300" height="80" rx="8" style={fill('wood')} />
      <rect x="-130" y="70" width="14" height="46" style={fill('wood')} />
      <rect x="116" y="70" width="14" height="46" style={fill('wood')} />
      <rect x="-150" y="-60" width="300" height="56" rx="8" style={fill('cream')} />
      <g transform="translate(-30 -34) scale(1 0.3)">
        <circle r="104" style={fill('ink')} />
        <g className={`room-spin${playing ? ' is-playing' : ''}`}>
          <circle r="92" style={fill('ink')} strokeWidth="0" />
          <circle r="70" style={{ fill: 'none', stroke: 'var(--r-cream)', strokeWidth: 3, opacity: 0.35 }} />
          <circle r="52" style={{ fill: 'none', stroke: 'var(--r-cream)', strokeWidth: 3, opacity: 0.25 }} />
          <circle r="32" style={fill('pink')} strokeWidth="3" />
          <circle r="5" style={fill('cream')} strokeWidth="0" />
          <path d="M-86 0 A86 86 0 0 1 -40 -76" style={{ fill: 'none', stroke: 'var(--r-cream)', strokeWidth: 6, opacity: 0.5 }} />
        </g>
      </g>
      <g transform="translate(112 -48)">
        <circle r="14" style={fill('mustard')} />
        <path
          d="M0 0 L-110 24"
          className={`room-tonearm${playing ? ' is-playing' : ''}`}
          style={{ fill: 'none', stroke: 'var(--r-ink)', strokeWidth: 7 }}
        />
      </g>
      <circle cx="-120" cy="36" r="9" style={fill('amber')} />
      <circle cx="-92" cy="36" r="9" style={fill('cream')} />
    </g>
  )
}

export function Poster({ kind }) {
  const color = kind === 'star' ? 'pink' : kind === 'note' ? 'mustard' : 'violet'
  return (
    <g {...ink} transform="rotate(-3)">
      <rect x="-62" y="-84" width="124" height="168" style={fill(color)} />
      <rect x="-50" y="-72" width="100" height="144" style={fill('cream', { opacity: 0.88 })} />
      {kind === 'star' && (
        <path d="M0 -50 L12 -16 L48 -14 L20 8 L30 44 L0 24 L-30 44 L-20 8 L-48 -14 L-12 -16Z" style={fill(color)} />
      )}
      {kind === 'note' && (
        <g style={fill('ink')}>
          <ellipse cx="-14" cy="26" rx="18" ry="13" />
          <rect x="1" y="-46" width="8" height="72" />
          <path d="M9 -46 Q40 -34 34 -2 Q26 -22 9 -24Z" />
        </g>
      )}
      {kind === 'peace' && (
        <g style={{ fill: 'none' }}>
          <circle cx="0" cy="-4" r="40" />
          <path d="M0 -44 V36 M0 -4 L-28 24 M0 -4 L28 24" />
        </g>
      )}
      <rect x="-34" y="-96" width="68" height="20" style={fill('cream', { opacity: 0.7 })} strokeWidth="2" />
      <path d="M-40 52 H40" style={{ stroke: 'var(--r-ink)', strokeWidth: 4 }} />
    </g>
  )
}

export function Tv({ playing }) {
  return (
    <g {...ink}>
      <path d="M-30 -92 L-70 -150 M30 -92 L70 -150" style={{ fill: 'none' }} />
      <rect x="-120" y="-94" width="240" height="170" rx="16" style={fill('wood')} />
      <rect x="-98" y="-76" width="150" height="130" rx="22" style={fill('ink')} />
      <g clipPath="url(#room-tv-clip)">
        {playing ? (
          <g transform="translate(-23 -11)">
            <rect x="-75" y="-65" width="150" height="130" style={fill('teal')} strokeWidth="0" />
            <InkBurst playing scale={1.1} />
          </g>
        ) : (
          <rect x="-98" y="-76" width="150" height="130" filter="url(#room-static)" style={fill('cream', { opacity: 0.75 })} strokeWidth="0" />
        )}
      </g>
      <circle cx="86" cy="-44" r="14" style={fill('amber')} />
      <circle cx="86" cy="-8" r="14" style={fill('cream')} />
      <path d="M72 24 H100 M72 34 H100 M72 44 H100" style={{ stroke: 'var(--r-ink)', strokeWidth: 4 }} />
      <rect x="-96" y="76" width="16" height="28" style={fill('wood')} />
      <rect x="80" y="76" width="16" height="28" style={fill('wood')} />
    </g>
  )
}

const SPINES = [
  ['pink', 78], ['teal', 92], ['mustard', 70], ['violet', 96], ['cream', 84],
  ['pink', 88], ['teal', 72], ['mustard', 94], ['violet', 80], ['cream', 90],
]

export function Shelf() {
  return (
    <g {...ink}>
      <rect x="-170" y="52" width="340" height="18" style={fill('wood')} />
      <path d="M-150 70 V100 M150 70 V100" />
      {SPINES.map(([c, h], i) => (
        <rect key={i} x={-158 + i * 18} y={52 - h} width="16" height={h} style={fill(c)} />
      ))}
      <rect x="28" y="22" width="52" height="30" rx="3" style={fill('cream')} />
      <circle cx="43" cy="37" r="6" style={fill('ink')} />
      <circle cx="65" cy="37" r="6" style={fill('ink')} />
      <rect x="86" y="22" width="52" height="30" rx="3" style={fill('amber')} />
      <circle cx="101" cy="37" r="6" style={fill('ink')} />
      <circle cx="123" cy="37" r="6" style={fill('ink')} />
    </g>
  )
}

export function LavaLamp() {
  return (
    <g {...ink}>
      <path d="M-30 100 L-18 40 H18 L30 100Z" style={fill('wood')} />
      <path d="M-22 40 L-34 -80 Q0 -110 34 -80 L22 40Z" style={fill('amber', { opacity: 0.55 })} />
      <g clipPath="url(#room-lava-clip)">
        <circle className="room-blob room-blob--a" cx="-6" cy="20" r="14" style={fill('pink')} strokeWidth="3" />
        <circle className="room-blob room-blob--b" cx="8" cy="30" r="10" style={fill('pink')} strokeWidth="3" />
        <circle className="room-blob room-blob--c" cx="0" cy="25" r="8" style={fill('mustard')} strokeWidth="3" />
      </g>
      <path d="M-14 -88 Q0 -104 14 -88 L10 -80 H-10Z" style={fill('wood')} />
      <circle className="room-lava-glow" cx="0" cy="-20" r="90" style={{ fill: 'var(--r-amber)', stroke: 'none', pointerEvents: 'none' }} />
    </g>
  )
}

export function Sofa() {
  return (
    <g {...ink}>
      <rect x="-150" y="-50" width="300" height="90" rx="26" style={fill('violet')} />
      <rect x="-170" y="-10" width="46" height="76" rx="18" style={fill('violet')} />
      <rect x="124" y="-10" width="46" height="76" rx="18" style={fill('violet')} />
      <rect x="-120" y="0" width="240" height="50" rx="14" style={fill('pink')} />
      <path d="M-140 66 V84 M140 66 V84" />
    </g>
  )
}

export function Plant() {
  return (
    <g {...ink}>
      <path d="M-34 20 H34 L26 90 H-26Z" style={fill('wood')} />
      <path d="M0 20 Q-70 -20 -60 -90 Q-14 -50 0 20Z M0 20 Q60 -30 56 -100 Q10 -60 0 20Z M0 20 Q-8 -50 6 -110 Q24 -50 0 20Z" style={fill('teal')} />
    </g>
  )
}

export function Guitar() {
  return (
    <g {...ink} transform="rotate(-18)">
      <rect x="-8" y="-150" width="16" height="130" style={fill('wood')} />
      <path d="M-18 -168 H18 V-148 H-18Z" style={fill('ink')} />
      <path d="M0 -30 C-70 -36 -74 40 -30 52 C-70 90 -10 120 0 100 C10 120 70 90 30 52 C74 40 70 -36 0 -30Z" style={fill('amber')} />
      <circle cx="0" cy="30" r="16" style={fill('ink')} />
    </g>
  )
}

export function Tape() {
  return (
    <g {...ink}>
      <rect x="-60" y="-38" width="120" height="76" rx="8" style={fill('cream')} />
      <rect x="-44" y="-26" width="88" height="26" rx="4" style={fill('mustard')} />
      <circle cx="-22" cy="12" r="12" style={fill('ink')} />
      <circle cx="22" cy="12" r="12" style={fill('ink')} />
    </g>
  )
}

export function Keys() {
  return (
    <g {...ink}>
      <rect x="-150" y="-34" width="300" height="68" rx="8" style={fill('ink')} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-142 + i * 24} y="-24" width="22" height="48" style={fill('cream')} strokeWidth="3" />
      ))}
      <rect x="-142" y="-24" width="284" height="8" style={fill('pink')} strokeWidth="0" />
    </g>
  )
}
