# Forever Talent Calculator

Talent calculator for World of Warcraft Forever.

Classic three-tree layout and 51-point rules. Data lives in `src/data/talents.json` (Classic 1.12 foundation, edited for Forever).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 — starts on Mage.

Live site: https://nikftw.github.io/forevertalent/

## Controls

- Left click: spend a point
- Right click: remove a point
- Shift-click: fill that talent
- Copy the URL to share a build

## Reference screenshots

Forever tooltip crops used for data review are in `public/{class}new/` (e.g. `public/magenew/`). Files are named after the talent (`improved-channeling.png`) with `overview.png` for the three-tree shot. See `src/data/README.md`.
