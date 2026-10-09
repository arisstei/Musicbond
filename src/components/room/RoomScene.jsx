import { useEffect, useMemo, useRef, useState } from 'react'
import { ITEM_DRAWINGS } from './itemDrawings'

const W = 1600
const H = 1000
const WINDOW = { x: 1120, y: 200, w: 320, h: 280 }
const BULB_COLORS = ['amber', 'pink', 'teal', 'cream']

// Σημείο πάνω σε τετραγωνική καμπύλη (το σύρμα με τα φωτάκια).
function strand(t) {
  const [x0, y0, cx, cy, x1, y1] = [30, 50, 800, 260, 1570, 50]
  const u = 1 - t
  return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1]
}

// Ψευδοτυχαία αλλά σταθερή τιμή, ώστε η βροχή/σκόνη να μη «πηδά» σε κάθε render.
const rnd = (i, salt) => {
  const s = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return s - Math.floor(s)
}

export function RoomScene({ layout, playing, editing, selectedId, onItemPointerDown }) {
  const boilRef = useRef(null)
  const staticRef = useRef(null)
  const [night] = useState(() => {
    const h = new Date().getHours()
    return h >= 19 || h < 7
  })

  // «Βράσιμο» των γραμμών: αλλάζουμε το seed του θορύβου ~7 φορές/δευτερόλεπτο.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined
    let n = 0
    const id = setInterval(() => {
      n = (n + 1) % 4
      boilRef.current?.setAttribute('seed', String(n + 1))
      staticRef.current?.setAttribute('seed', String(Math.floor(Math.random() * 99)))
    }, 140)
    return () => clearInterval(id)
  }, [])

  const bulbs = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const [x, y] = strand(0.03 + (i / 21) * 0.94)
        return { x, y, color: BULB_COLORS[i % BULB_COLORS.length], delay: (i * 0.37) % 3 }
      }),
    [],
  )
  const rain = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        x: WINDOW.x + 10 + rnd(i, 1) * (WINDOW.w - 20),
        delay: rnd(i, 2) * 1.6,
        dur: 0.7 + rnd(i, 3) * 0.6,
      })),
    [],
  )
  const dust = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        x: 760 + rnd(i, 4) * 520,
        y: 520 + rnd(i, 5) * 420,
        r: 2 + rnd(i, 6) * 2.4,
        delay: rnd(i, 7) * 6,
        dur: 7 + rnd(i, 8) * 6,
      })),
    [],
  )

  return (
    <svg
      className={`room-svg${night ? ' is-night' : ''}`}
      viewBox={`0 0 ${W} ${H}`}
      data-wall={layout.wall}
      data-floor={layout.floor}
      role="img"
      aria-label="Το δωμάτιο"
    >
      <defs>
        <filter id="room-boil" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence ref={boilRef} type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="1" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="7" />
        </filter>
        <filter id="room-static" x="0" y="0" width="100%" height="100%">
          <feTurbulence ref={staticRef} type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <filter id="room-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="9" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id="room-tv-clip">
          <rect x="-98" y="-76" width="150" height="130" rx="22" />
        </clipPath>
        <clipPath id="room-lava-clip">
          <path d="M-22 40 L-34 -80 Q0 -110 34 -80 L22 40Z" />
        </clipPath>
        <clipPath id="room-window-clip">
          <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.h} />
        </clipPath>
        <pattern id="room-p-stripes" width="64" height="64" patternUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="var(--r-teal)" />
          <rect width="32" height="64" fill="var(--r-teal-light)" />
        </pattern>
        <pattern id="room-p-dots" width="48" height="48" patternUnits="userSpaceOnUse">
          <rect width="48" height="48" fill="var(--r-pink)" />
          <circle cx="12" cy="12" r="5" fill="var(--r-cream)" opacity="0.7" />
          <circle cx="36" cy="36" r="5" fill="var(--r-cream)" opacity="0.7" />
        </pattern>
        <pattern id="room-p-plain" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="var(--r-teal)" />
        </pattern>
        <pattern id="room-p-wood" width="400" height="48" patternUnits="userSpaceOnUse">
          <rect width="400" height="48" fill="var(--r-wood)" />
          <rect width="400" height="24" fill="var(--r-ink)" opacity="0.08" />
          <path d="M0 0 H400 M0 24 H400 M210 0 V24 M90 24 V48" stroke="var(--r-ink)" strokeWidth="3" opacity="0.5" />
        </pattern>
        <pattern id="room-p-checker" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="var(--r-cream)" />
          <rect width="60" height="60" fill="var(--r-ink)" opacity="0.8" />
          <rect x="60" y="60" width="60" height="60" fill="var(--r-ink)" opacity="0.8" />
        </pattern>
        <pattern id="room-p-carpet" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="var(--r-red)" />
        </pattern>
        <radialGradient id="room-vignette" cx="50%" cy="50%" r="75%">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1a120e" stopOpacity="0.55" />
        </radialGradient>
        <radialGradient id="room-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--r-amber)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--r-amber)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g filter="url(#room-boil)" style={{ stroke: 'var(--r-ink)', strokeWidth: 5, strokeLinejoin: 'round', strokeLinecap: 'round' }}>
        {/* τοίχος και πάτωμα */}
        <rect x="-10" y="-10" width={W + 20} height="640" fill={`url(#room-p-${layout.wall})`} stroke="none" />
        <rect x="-10" y="620" width={W + 20} height="400" fill={`url(#room-p-${layout.floor})`} stroke="none" />
        <rect x="-10" y="596" width={W + 20} height="30" style={{ fill: 'var(--r-cream)' }} />

        {/* χαλί */}
        <ellipse cx="800" cy="840" rx="470" ry="96" style={{ fill: 'var(--r-pink)' }} />
        <ellipse cx="800" cy="840" rx="400" ry="74" style={{ fill: 'var(--r-mustard)', opacity: 0.85 }} />
        <ellipse cx="800" cy="840" rx="320" ry="52" style={{ fill: 'var(--r-pink)' }} />

        {/* παράθυρο */}
        <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.h} style={{ fill: night ? 'var(--r-night)' : 'var(--r-day)' }} />
        {night ? (
          <circle cx={WINDOW.x + 240} cy={WINDOW.y + 70} r="30" style={{ fill: 'var(--r-cream)' }} />
        ) : (
          <circle cx={WINDOW.x + 240} cy={WINDOW.y + 70} r="34" style={{ fill: 'var(--r-amber)' }} />
        )}
        <path d={`M${WINDOW.x + WINDOW.w / 2} ${WINDOW.y} V${WINDOW.y + WINDOW.h} M${WINDOW.x} ${WINDOW.y + WINDOW.h / 2} H${WINDOW.x + WINDOW.w}`} style={{ fill: 'none', strokeWidth: 8 }} />
        <rect x={WINDOW.x - 10} y={WINDOW.y - 10} width={WINDOW.w + 20} height={WINDOW.h + 20} style={{ fill: 'none', strokeWidth: 12 }} />
        <path d={`M${WINDOW.x - 60} ${WINDOW.y - 30} Q${WINDOW.x - 20} ${WINDOW.y + 140} ${WINDOW.x - 56} ${WINDOW.y + WINDOW.h + 40} H${WINDOW.x - 4} V${WINDOW.y - 30}Z`} style={{ fill: 'var(--r-pink)' }} />
        <path d={`M${WINDOW.x + WINDOW.w + 60} ${WINDOW.y - 30} Q${WINDOW.x + WINDOW.w + 20} ${WINDOW.y + 140} ${WINDOW.x + WINDOW.w + 56} ${WINDOW.y + WINDOW.h + 40} H${WINDOW.x + WINDOW.w + 4} V${WINDOW.y - 30}Z`} style={{ fill: 'var(--r-pink)' }} />
        <rect x={WINDOW.x - 20} y={WINDOW.y + WINDOW.h + 10} width={WINDOW.w + 40} height="20" style={{ fill: 'var(--r-wood)' }} />

        {/* σύρμα φωτάκια */}
        <path d={`M30 50 Q800 260 1570 50`} style={{ fill: 'none', strokeWidth: 4 }} />

        {/* αντικείμενα (πίσω → μπρος ανάλογα με το y) */}
        {[...layout.items]
          .sort((a, b) => a.y - b.y)
          .map((item) => {
            const d = ITEM_DRAWINGS[item.type]
            if (!d) return null
            const selected = editing && selectedId === item.id
            return (
              <g
                key={item.id}
                className={`room-item${editing ? ' is-editable' : ''}${selected ? ' is-selected' : ''}`}
                transform={`translate(${(item.x / 100) * W} ${(item.y / 100) * H})`}
                onPointerDown={(e) => onItemPointerDown?.(e, item)}
              >
                {d.render({ playing })}
                <rect x={-d.w / 2} y={-d.h / 2} width={d.w} height={d.h} className="room-hit" />
              </g>
            )
          })}
      </g>

      {/* ό,τι δεν «βράζει»: φωτισμός, βροχή, σκόνη, λάμπες */}
      <g clipPath="url(#room-window-clip)" style={{ stroke: 'var(--r-cream)', strokeWidth: 3, opacity: 0.75 }}>
        {rain.map((r, i) => (
          <line
            key={i}
            className="room-rain"
            x1={r.x}
            y1={WINDOW.y - 40}
            x2={r.x - 8}
            y2={WINDOW.y - 10}
            style={{ animationDelay: `${r.delay}s`, animationDuration: `${r.dur}s`, '--fall': `${WINDOW.h + 60}px` }}
          />
        ))}
      </g>

      <polygon
        points={`${WINDOW.x},${WINDOW.y + WINDOW.h} ${WINDOW.x + WINDOW.w},${WINDOW.y + WINDOW.h} ${WINDOW.x + WINDOW.w - 340},1000 ${WINDOW.x - 560},1000`}
        style={{ fill: night ? 'var(--r-cream)' : 'var(--r-amber)', opacity: night ? 0.07 : 0.14 }}
      />
      {dust.map((d, i) => (
        <circle
          key={i}
          className="room-dust"
          cx={d.x}
          cy={d.y}
          r={d.r}
          style={{ animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s` }}
        />
      ))}

      {bulbs.map((b, i) => (
        <g key={i} className="room-bulb" style={{ animationDelay: `${b.delay}s` }}>
          <circle cx={b.x} cy={b.y + 14} r="30" fill="url(#room-glow)" />
          <circle cx={b.x} cy={b.y + 14} r="10" style={{ fill: `var(--r-${b.color})`, stroke: 'var(--r-ink)', strokeWidth: 3 }} />
        </g>
      ))}

      {/* ατμόσφαιρα: νύχτα, κόκκος χαρτιού, βινιέτα */}
      {night && <rect width={W} height={H} style={{ fill: 'var(--r-night)', opacity: 0.32, pointerEvents: 'none' }} />}
      <rect width={W} height={H} filter="url(#room-grain)" style={{ opacity: 0.1, mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      <rect width={W} height={H} style={{ fill: 'url(#room-vignette)', pointerEvents: 'none' }} />
    </svg>
  )
}
