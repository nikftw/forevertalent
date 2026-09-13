# Talent data

`talents.json` is the **Classic 1.12 foundation**, not final Forever trees.

Wowhead’s Forever calculator currently republishes Classic talents. We keep that layout (4×7 grids, 51 points, arrows, ranks) and will patch names, icons, ranks, prerequisites, and tooltip text here as Forever diffs land.

## How to change a talent

Edit the matching object under `classes[].trees[].talents[]`:

- `name`, `icon`, `row`, `col`, `maxRank`
- `requires`: `[{ "id": <talentId>, "qty": <ranks needed> }]`
- `ranks[]`: one entry per rank, with `description` (the tooltip)

To add a talent, give it a unique `id` (use 90001+ for Forever-only nodes) and place it on the 0–6 row / 0–3 column grid. To remove one, delete the object. The calculator reads this file only — no Wowhead calls at runtime.

## Review dots

`review-status.json` is keyed by talent `id` and sets the corner indicator.
Statuses are judged against Classic 1.12 talent **spell names** (same class) and
rank-1 tooltips from the classic foundation:

- `new` (red) — not a Classic talent name for that class (brand-new or renamed)
- `updated` (orange) — Classic spell name, tooltip differs
- `classic` (grey) — Classic spell name and same (or near-identical) tooltip
- `unchanged` (green) — unused; kept for type compatibility only

Drop in-game screenshots in `public/{class}/`: one overview of the three trees, then separate icon and tooltip shots. Do not invent row/col for new talents until the overview shows the slot.

## Legacy class

`legacy` is a separate class entry for the Forever Legacy Point trees (Adventure, Resourcefulness, Professions). Talent names/tooltips follow the in-game tree screenshot; icons are taken from [wowforevertalents.com/legacy](https://wowforevertalents.com/legacy/). It uses `maxPoints`, `pointsPerTier: 0` (arrow gates only), and `pointsLabel: "LP left"`.

