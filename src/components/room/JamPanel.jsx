import { useState } from 'react'
import { SONOBUS_DOWNLOAD, buildSonobusUrl, jamGroupName } from '../../lib/jam'

// Κουμπί «Jam»: ανοίγει το SonoBus στην ομάδα του δωματίου. Ο ιδιοκτήτης και
// οι επισκέπτες μπαίνουν στην ίδια ομάδα και παίζουν peer-to-peer.
export function JamPanel({ ownerUserId, jamSecret = null }) {
  const [password, setPassword] = useState('')

  const group = jamGroupName(ownerUserId, jamSecret)
  const url = buildSonobusUrl({ ownerUserId, jamSecret, password })

  return (
    <section className="room-panel">
      <p className="room-label">🎸 Jam σε πραγματικό χρόνο</p>
      <div className="room-row">
        <a className="room-btn room-btn--primary" href={url}>
          Μπες στο Jam
        </a>
        <input
          className="room-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Κωδικός ομάδας (προαιρετικός)"
          maxLength={64}
          autoComplete="off"
        />
      </div>
      <p className="room-hint">
        Ομάδα: <code>{group}</code>. Χρειάζεται η δωρεάν εφαρμογή SonoBus και ακουστικά
        (δεν υπάρχει ακύρωση ηχούς).{' '}
        <a href={SONOBUS_DOWNLOAD} target="_blank" rel="noreferrer">
          Κατέβασέ την
        </a>
        . Αν ορίσεις κωδικό, πες τον στους άλλους μουσικούς.
      </p>
    </section>
  )
}
