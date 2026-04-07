# Love Resilience — Project State

## What This Is
A 3D card deck web app for Tanja's Love Resilience coaching practice. 70 cards focused on practical spirituality and resilience. Deployed to GitHub Pages, embedded as iframe in Tanja's website (built with a visual website builder).

**Live dev server:** `http://192.168.1.128:5173/LoveResilience/` (local network)

---

## App Flow
```
welcome → centering → selection
welcome → daily card
```
- **Welcome**: title + two buttons (Card of the Day / Draw a Card)
- **Centering**: breathing exercise (4s in / 7s out × 3 breaths), then intention + ready phases
- **Selection**: 4×3 card grid — pick a card, see it flip to front, read question
- **Daily**: today's card (deterministic per user/date), shows meaning + buttons

`viewing` state has been removed — card viewing now happens in-place within the selection scene.

---

## Tech Stack
- React + TypeScript, Vite
- React Three Fiber (3D canvas)
- @react-spring/three (all card animations)
- Zustand (global state)
- GitHub Pages deployment (`base: '/LoveResilience/'`)

---

## Key Architecture Decisions

### Single persistent Canvas
`UnifiedCanvas` → `SceneOrchestrator` renders all scenes. Cross-fade transitions between states. `SelectionScene` is always mounted (even when not active) so cards are never cold-loaded.

### All text is HTML overlay, not 3D
Every scene has a matching HTML overlay component for text/buttons. Three.js canvas contains only 3D geometry (cards, orb). This keeps mobile layout clean and CSS animations simple.

### Card pool (object pooling)
`SelectionScene` maintains 12 fixed slots (`slot-0` through `slot-11`) with stable React keys. Cards never unmount — only their `frontPath`/`backPath` props change on shuffle. This prevents texture reload jank.

### Card3D — single spring for everything
`src/components/scenes/Card3D.tsx` — one `useSpring` drives x/y/z position, scale, rotationY (flip), opacity, and hover lift. Props: `targetPosition`, `targetOpacity`, `targetScale`, `flipped`, `interactive`.

### Orb — shared component
`src/components/scenes/OrbMesh.tsx` — uses `Orb.png` (golden circle extracted from card backside). Radial alpha mask fades to transparent at 95% radius. Used in WelcomeScene (float), CenteringScene (breathes with user), DailyCardScene (behind card).

### Card content from markdown
`src/data/cardLoader.ts` uses `import.meta.glob('/card-content/*.md', { query: '?raw' })` to parse all 70 card markdown files at build time. Extracts `# Meaning`, `# Question`, `# Action` sections. No runtime fetching.

---

## SelectionScene Mode State Machine
```
spawning → grid → focusing → grid
                grid → shuffling → spawning → grid
```
- **spawning**: all 12 cards at stacked deck position (z-offset per index), spring toward grid
- **grid**: interactive, hover lifts cards toward camera
- **focusing**: selected card moves to `[0, 0, 4]` and flips to front face; others fade to opacity=0 (not unmounted); question shown in HTML overlay
- **shuffling**: all cards spring back to deck → slot data swapped → spawning again

Shuffle timing: 900ms wait (cards reach deck) → swap card data in slots → double rAF → grid.

Focus scale is responsive: `aspect >= 1 ? 1.25 : 3.0` (desktop/landscape vs portrait/mobile).

---

## File Structure
```
src/
  App.tsx                          — loads card data, mounts overlays + canvas
  components/
    Welcome.tsx                    — HTML overlay: title + Card of Day / Draw a Card buttons
    Centering.tsx                  — HTML overlay: breathing counter, phase text, buttons
    CardSelection.tsx              — HTML overlay: "Trust Your Intuition" / question + buttons
    DailyCard.tsx                  — HTML overlay: date, meaning, action buttons
    TextureLoader.tsx              — SafeTexture component (Safari WebGL fixes, image resize)
    UnifiedCanvas.tsx              — full-screen Three.js canvas wrapper (100dvh)
    scenes/
      SceneOrchestrator.tsx        — renders correct scene, cross-fade transitions
      WelcomeScene.tsx             — floating orb
      CenteringScene.tsx           — breathing orb (scales with breath phase)
      SelectionScene.tsx           — 12-card pool, mode state machine, camera controller
      DailyCardScene.tsx           — single card + orb behind it
      Card3D.tsx                   — two-face card mesh, single spring animation
      OrbMesh.tsx                  — shared orb: Orb.png + radial alpha fade + optional float/breath
  store/
    useAppStore.ts                 — Zustand store: app state, selected/focused card, triggerShuffle
  data/
    cardLoader.ts                  — parses card-content/*.md + cardManifest, builds Card[]
    cardManifest.ts                — list of all 70 JPG filenames
  types/
    Card.ts                        — Card, CardData, AppState types

public/
  CardSet/          — 70 card front JPGs
  Backside.jpg      — universal card back (golden mandala)
  Cover.png
  Orb.png           — golden circle PNG (extracted from Backside.jpg)

card-content/       — 70 markdown files, one per card
                      Format: frontmatter + # Meaning / # Question / # Action / # Quote sections
```

---

## Store Shape (useAppStore)
```ts
currentState: 'welcome' | 'centering' | 'selection' | 'daily'
selectedCard: Card | null          // card whose content is shown
focusedCardId: string | null       // which card is zoomed in selection scene
cardData: CardData | null          // all 70 cards + backside/cover paths
triggerShuffle: (() => void) | null // set by SelectionScene, called by CardSelection overlay
centeringPhase: 'check' | 'breathe' | 'intention' | 'ready'
breathPhase: 'in' | 'out'
```

---

## Known Issues / Next Up
1. **Spawn/shuffle jank** — object pooling (stable slot keys) mostly solves this, but texture swap on shuffle still causes a brief flash. Next step: keep `SelectionScene` always-mounted in `SceneOrchestrator` (currently it unmounts when state changes away from `selection`), and pre-warm textures on welcome screen.
2. **Focus scale** — responsive (`1.25` landscape / `3.0` portrait) but may need further tuning per device.
3. **Centering flow** — after 3 breaths, "Set your intention" fades in/out over 7s, then "You are centered and ready" over 4s, then auto-navigates to selection.
4. **Daily card** — "Explore Deeper" button navigates to `selection` (not a separate viewing scene — viewing was removed).
5. **Questions** — each card now has its real question from the markdown files (not generic). Only the first question is shown below the focused card.

---

## Deployment
```bash
npm run build    # builds to dist/
npm run dev -- --host  # dev server accessible on local network
```
GitHub Pages deployment via `gh-pages` package. Base URL: `/LoveResilience/`.
