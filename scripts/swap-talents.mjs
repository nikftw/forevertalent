#!/usr/bin/env node
/**
 * Instant talent row/col swap by icon (or id).
 * Usage:
 *   node scripts/swap-talents.mjs <iconA> <iconB>
 *   node scripts/swap-talents.mjs warlock <iconA> <iconB>
 *   node scripts/swap-talents.mjs 1001 90208
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "src/data/talents.json");

const args = process.argv.slice(2).filter(Boolean);
if (args.length < 2 || args.length > 3) {
  console.error("Usage: node scripts/swap-talents.mjs [classSlug] <iconOrIdA> <iconOrIdB>");
  process.exit(1);
}

const classSlug = args.length === 3 ? args[0].toLowerCase() : null;
const aKey = args.length === 3 ? args[1] : args[0];
const bKey = args.length === 3 ? args[2] : args[1];

const data = JSON.parse(readFileSync(path, "utf8"));

function matchKey(tal, key) {
  if (/^\d+$/.test(key)) return tal.id === Number(key);
  const k = key.replace(/\.jpg$/i, "").toLowerCase();
  return String(tal.icon || "").toLowerCase() === k;
}

const hits = [];
for (const cls of data.classes) {
  if (classSlug && cls.slug !== classSlug) continue;
  for (const tree of cls.trees) {
    for (const tal of tree.talents) {
      if (matchKey(tal, aKey) || matchKey(tal, bKey)) {
        hits.push({ cls: cls.slug, tree: tree.name, tal });
      }
    }
  }
}

const aHits = hits.filter((h) => matchKey(h.tal, aKey));
const bHits = hits.filter((h) => matchKey(h.tal, bKey));

if (aHits.length !== 1 || bHits.length !== 1) {
  console.error(
    `Need exactly one match each. A=${aHits.length} B=${bHits.length}`,
    { a: aHits.map((h) => `${h.cls}/${h.tree}/${h.tal.name}`), b: bHits.map((h) => `${h.cls}/${h.tree}/${h.tal.name}`) },
  );
  process.exit(1);
}

const a = aHits[0].tal;
const b = bHits[0].tal;
if (a === b) {
  console.error("Same talent");
  process.exit(1);
}

const ar = a.row;
const ac = a.col;
a.row = b.row;
a.col = b.col;
b.row = ar;
b.col = ac;

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(`ok ${a.name}↔${b.name}`);
