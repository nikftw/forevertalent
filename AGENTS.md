# Forever Talent Calculator

## Purpose
World of Warcraft Forever talent calculator. Classic 4×7 three-tree layout. `src/data/talents.json` is a Classic 1.12 foundation — Wowhead Forever currently republishes Classic — and should be edited for actual Forever talent/tooltip/icon changes.

## Run
```bash
npm install
npm run dev
```

## Conventions
- Next.js App Router + TypeScript + Tailwind v4
- Talent rules live in `src/lib/talents.ts`
- Forever diffs go in `src/data/talents.json` (see `src/data/README.md`)
- Do not reintroduce the player-mock patch notes / New-Changed-Moved markers
- Do not treat Wowhead Forever as authoritative talent text

## Do not
- Commit secrets
- Copy Wowhead UI code; keep our own calculator
