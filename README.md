# Valentine Web App

A single-page Valentine app built with Vite + React + Tailwind.

## Features

- Main question: **Will you be my Valentine?**
- `Yes` shows a happy cat GIF.
- `No` shows a hissing cat GIF.
- Uses local assets first (`/assets/happy-cat.gif` and `/assets/hissing-cat.gif`) with graceful fallback URLs.
- Soft pastel visual theme with design tokens (colors, radius, shadows, spacing).
- Polished UI states, subtle micro-animations, and reduced-motion support.

## Project structure

- `src/components` - reusable UI components
- `src/constants` - local/fallback asset mappings
- `public/assets` - optional local GIF files

## Run locally

```bash
npm install
npm run dev
npm run build
```

## Optional local assets

Place these files in `public/assets`:

- `happy-cat.gif`
- `hissing-cat.gif`

If either file is missing, the app automatically uses fallback GIF URLs.
