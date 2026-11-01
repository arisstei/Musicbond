// Jam (ζωντανή ηχητική συνεδρία) μέσω της εφαρμογής SonoBus (GPL-3.0, sonobus.net).
// Ο ήχος ΔΕΝ περνά από το MusicBond: ο browser απλώς ανοίγει την εφαρμογή με
// sonobus://host/?g=ομάδα&p=κωδικός και οι μουσικοί συνδέονται peer-to-peer.

export const JAM_SERVER = 'aoo.sonobus.net:10998'
export const SONOBUS_DOWNLOAD = 'https://sonobus.net/'

// Όνομα ομάδας: με το μυστικό του δωματίου (sql/005) όταν υπάρχει, αλλιώς
// από το id του ιδιοκτήτη (παλιά συμπεριφορά, όσο δεν έχει τρέξει το sql/005).
export function jamGroupName(ownerUserId, jamSecret = null) {
  const source = jamSecret || ownerUserId
  const clean = String(source || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)
  return `musicbond-${clean}`
}

export function buildSonobusUrl({ ownerUserId, jamSecret = null, password = '', server = JAM_SERVER }) {
  const params = new URLSearchParams({ g: jamGroupName(ownerUserId, jamSecret) })
  if (password) params.set('p', password)
  return `sonobus://${server}/?${params.toString()}`
}
