import { Guitar, Keys, LavaLamp, Plant, Poster, Shelf, Sofa, Tape, Turntable, Tv } from './RoomItems'

// Κατάλογος σχεδίων: type -> { w, h, render(props) } (σε μονάδες του viewBox 1600x1000)
export const ITEM_DRAWINGS = {
  turntable: { w: 320, h: 180, render: (p) => <Turntable {...p} /> },
  'poster-star': { w: 140, h: 190, render: () => <Poster kind="star" /> },
  'poster-note': { w: 140, h: 190, render: () => <Poster kind="note" /> },
  'poster-peace': { w: 140, h: 190, render: () => <Poster kind="peace" /> },
  tv: { w: 250, h: 270, render: (p) => <Tv {...p} /> },
  shelf: { w: 350, h: 220, render: () => <Shelf /> },
  lamp: { w: 100, h: 220, render: () => <LavaLamp /> },
  sofa: { w: 340, h: 170, render: () => <Sofa /> },
  plant: { w: 150, h: 220, render: () => <Plant /> },
  guitar: { w: 170, h: 300, render: () => <Guitar /> },
  tape: { w: 130, h: 90, render: () => <Tape /> },
  keys: { w: 310, h: 80, render: () => <Keys /> },
}
