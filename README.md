# Love Resilience — Digital Card Deck

An interactive 3D preview of Tanja's *Love Resilience* physical card deck, designed to be embedded as an iframe on her coaching website.

70 cards in English and German. Built with React Three Fiber.

---

## What it does

- **Card of the Day** — deterministic daily card per user, shown face-up
- **Draw a Card** — centering breath exercise, then a 3D card grid to choose from
- **EN / DE toggle** — switches card face language without losing the current scene state

---

## Development

```bash
npm install
npm run dev -- --host   # dev server, accessible on local network
npm run build           # production build to dist/
```

Deployed to GitHub Pages. Base URL: `/LoveResilience/`

---

## Next steps

1. **Add questions** — receive the card question text document (ordered to match the 71 card images), wire it into `src/data/cardLoader.ts`, and display per-card questions in both EN and DE
2. **Deploy** — run `npm run build` and push to GitHub Pages via the `gh-pages` package
3. **Embed** — add an iframe to Tanja's website pointing to the deployed URL:

```html
<iframe
  src="https://projectliminality.github.io/LoveResilience/"
  width="100%"
  height="700px"
  frameborder="0"
  style="border-radius: 12px;"
></iframe>
```

For full-screen embedding, set the iframe to `height="100vh"` inside a full-width section in the website builder, and add `allow="fullscreen"` if needed.
