# Talent data

`talents.json` is the **Classic 1.12 foundation**, edited in place for Forever.

Wowhead’s Forever calculator currently republishes Classic. We keep the Classic layout (4×7 grids, 51 points, arrows, ranks) and patch names, icons, ranks, prerequisites, and tooltip text here as Forever diffs land. Screenshot text from in-game Forever is authoritative over Wowhead.

## How to change a talent

Edit the matching object under `classes[].trees[].talents[]`:

- `name`, `icon`, `row`, `col`, `maxRank`
- `requires`: `[{ "id": <talentId>, "qty": <ranks needed> }]`
- `ranks[]`: one entry per rank, with `description` (the tooltip)

To add a talent, give it a unique `id` (use 90001+ for Forever-only nodes) and place it on the 0–6 row / 0–3 column grid. To remove one, delete the object. The calculator reads this file only — no Wowhead calls at runtime.

## Reference screenshots

Keep Forever tooltip crops in `public/{class}new/`:

- `overview.png` — full three-tree view
- `{talent-slug}.png` — one crop per talent (kebab-case spell name, e.g. `flame-throwing.png`)

Do not invent `row`/`col` for new talents until the overview shows the slot. Prefer renaming crops to spell names before committing; leave untitled `brave_*.png` out of git.

## Review dots

`review-status.json` is keyed by talent `id` and sets the corner indicator.
Statuses are judged against Classic 1.12 talent **spell names** (same class) and
rank-1 tooltips from the classic foundation:

- `new` (red) — not a Classic talent name for that class (brand-new or renamed)
- `updated` (orange) — Classic spell name, tooltip differs
- `classic` (grey) — Classic spell name and same (or near-identical) tooltip
- `unchanged` (green) — unused; kept for type compatibility only

## Legacy class

`legacy` is a separate class entry for the Forever Legacy Point trees (Adventure, Resourcefulness, Professions). Talent names/tooltips follow the in-game tree screenshot; icons are taken from [wowforevertalents.com/legacy](https://wowforevertalents.com/legacy/). It uses `maxPoints`, `pointsPerTier: 0` (arrow gates only), and `pointsLabel: "LP left"`.
