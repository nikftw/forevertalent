# Talent data

`talents.json` is the **Classic 1.12 foundation**, not final Forever trees.

Wowhead’s Forever calculator currently republishes Classic talents. We keep that layout (4×7 grids, 51 points, arrows, ranks) and will patch names, icons, ranks, prerequisites, and tooltip text here as Forever diffs land.

## How to change a talent

Edit the matching object under `classes[].trees[].talents[]`:

- `name`, `icon`, `row`, `col`, `maxRank`
- `requires`: `[{ "id": <talentId>, "qty": <ranks needed> }]`
- `ranks[]`: one entry per rank, with `description` (the tooltip)

To add a talent, give it a unique `id` and place it on the 0–6 row / 0–3 column grid. To remove one, delete the object. The calculator reads this file only — no Wowhead calls at runtime.
