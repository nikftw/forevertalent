# Forever Talent Calculator

## Purpose
World of Warcraft Forever talent calculator. Classic 4×7 three-tree layout.

`src/data/talents.json` starts from Classic 1.12 and is patched for Forever names, tooltips, icons, ranks, and prerequisites. Wowhead Forever currently republishes Classic — do **not** treat it as authoritative talent text.

## Run
```bash
npm install
npm run dev
```

## Conventions
- Next.js App Router + TypeScript + Tailwind v4
- Talent rules: `src/lib/talents.ts`
- Forever data edits: `src/data/talents.json` (see `src/data/README.md`)
- In-game tooltip reference shots: `public/{class}new/` — files named after the talent (`flame-throwing.png`) plus `overview.png`
- Do not reintroduce player-mock patch notes / New-Changed-Moved markers

## Do not
- Commit secrets
- Commit `.tmp/`, scrape helpers, or untitled `brave_*.png` crops
- Copy Wowhead UI code; keep our own calculator
