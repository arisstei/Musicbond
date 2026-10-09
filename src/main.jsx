import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { capturePendingStory } from './lib/stories'

// Αν ήρθαμε από το «Ταξίδι στη Μουσική» (?story=slug), κράτα το slug
// πριν το login, ώστε να ανοίξει το σωστό νήμα μετά.
capturePendingStory()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* κινούμενος κόκκος φωτοτυπίας/φιλμ πάνω από όλη την εφαρμογή */}
    <div className="grain-overlay" aria-hidden="true" />
  </StrictMode>,
)
