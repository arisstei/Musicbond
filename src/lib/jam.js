// Jam (ζωντανή ηχητική συνεδρία) μέσω της εφαρμογής SonoBus (GPL-3.0, sonobus.net).
// Ο ήχος ΔΕΝ περνά από το MusicBond: ο browser απλώς ανοίγει την εφαρμογή με
// sonobus://host/?g=ομάδα&p=κωδικός και οι μουσικοί συνδέονται peer-to-peer.

export const JAM_SERVER = 'aoo.sonobus.net:10998'
export const SONOBUS_DOWNLOAD = 'https://sonobus.net/'

// Όνομα ομάδας από το id του ιδιοκτήτη του δωματίου: ίδιο για όλους, χωρίς προσωπικά δεδομένα.
export function jamGroupName(ownerUserId) {
  const clean = String(ownerUserId || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)
  return `musicbond-${clean}`
}

export function buildSonobusUrl({ ownerUserId, password = '', server = JAM_SERVER }) {
  const params = new URLSearchParams({ g: jamGroupName(ownerUserId) })
  if (password) params.set('p', password)
  return `sonobus://${server}/?${params.toString()}`
}
