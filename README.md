# University Grade Tracker (Vite + React + TS)

This is a minimal Vite + React + TypeScript scaffold to run `tracker.tsx`.

Quick start:

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

Notes:
- This project includes Tailwind CSS; if you don't want Tailwind, remove `index.css` and the PostCSS files.
- `window.storage` is referenced by the component; in a normal browser environment this won't exist — it's likely provided by an extension or host. The app will catch errors and fall back to an empty state, but you can replace `window.storage` calls with localStorage if desired.

GitHub Pages deployment
- I added a GitHub Actions workflow (`.github/workflows/pages.yml`) which will automatically build and deploy the `dist/` directory to GitHub Pages whenever you push to `main`.
- Make sure the repository on GitHub is named `university_grade_tracker` (or change `base` in `vite.config.ts` to match your repo name).
- If you prefer `gh-pages` instead of Actions, install `gh-pages` and run `npm run deploy:gh-pages` (I added the script but did not install the package to keep devDependencies unchanged).
