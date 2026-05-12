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

Deployed automatically to **https://liminalconsulting.github.io/LoveResilience/** by `.github/workflows/deploy.yml` on every push to `main`. Base URL: `/LoveResilience/`

---

## Next steps

1. **Add questions** — receive the card question text document (ordered to match the 71 card images), wire it into `src/data/cardLoader.ts`, and display per-card questions in both EN and DE
2. **Deploy** — push to `main`; the GitHub Actions workflow builds and publishes to GitHub Pages automatically
3. **Embed** — add an iframe to Tanja's website pointing to the deployed URL:

```html
<iframe
  src="https://liminalconsulting.github.io/LoveResilience/"
  width="100%"
  height="700px"
  frameborder="0"
  style="border-radius: 12px;"
></iframe>
```

For full-screen embedding, set the iframe to `height="100vh"` inside a full-width section in the website builder, and add `allow="fullscreen"` if needed.

---

## Companion booklet (Büchlein)

The printed companion booklet that ships with the physical deck has its own Word template in [`Buechlein/`](./Buechlein/). See [`Buechlein/README.md`](./Buechlein/README.md) for the print spec, what's pre-configured, and how to rebuild the template.