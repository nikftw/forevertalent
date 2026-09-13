import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const classicPath = path.join(root, ".tmp", "classic-talents.json");
const currentPath = path.join(root, "src", "data", "talents.json");
const reviewPath = path.join(root, "src", "data", "review-status.json");

if (!fs.existsSync(classicPath)) {
  fs.mkdirSync(path.dirname(classicPath), { recursive: true });
  const buf = execSync("git show babab56:src/data/talents.json");
  fs.writeFileSync(classicPath, buf);
}

const classic = JSON.parse(fs.readFileSync(classicPath, "utf8"));
const current = JSON.parse(fs.readFileSync(currentPath, "utf8"));
const prev = JSON.parse(fs.readFileSync(reviewPath, "utf8"));

function normName(s) {
  return s
    .toLowerCase()
    .replace(/[''\u2019]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanTip(s) {
  return s
    .replace(/<!--ppl[^>]*-->(\d+)/g, "$1")
    .replace(/<!--singular:[^>]*-->([^<]*)<!--singular-->/g, "$1")
    .replace(/<!--.*?-->/g, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normTip(s) {
  return cleanTip(s)
    .toLowerCase()
    .replace(/[''\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[.,;:!]/g, "")
    .trim();
}

const next = {};
const counts = { new: 0, updated: 0, classic: 0 };
const byClass = {};
const updatedSamples = [];

for (const cls of current.classes) {
  byClass[cls.slug] = { new: 0, updated: 0, classic: 0 };

  if (cls.slug === "legacy") {
    for (const talent of cls.trees.flatMap((t) => t.talents)) {
      const id = String(talent.id);
      next[id] = {
        review: "new",
        ...(prev[id]?.screenshots ? { screenshots: prev[id].screenshots } : {}),
      };
      counts.new++;
      byClass[cls.slug].new++;
    }
    continue;
  }

  const classicClass = classic.classes.find((c) => c.slug === cls.slug);
  if (!classicClass) {
    throw new Error(`Missing classic class: ${cls.slug}`);
  }

  const byName = new Map();
  for (const talent of classicClass.trees.flatMap((t) => t.talents)) {
    byName.set(normName(talent.name), talent);
  }

  for (const talent of cls.trees.flatMap((t) => t.talents)) {
    const id = String(talent.id);
    const screenshots = prev[id]?.screenshots;
    const classicTalent = byName.get(normName(talent.name));

    if (!classicTalent) {
      next[id] = {
        review: "new",
        ...(screenshots ? { screenshots } : {}),
      };
      counts.new++;
      byClass[cls.slug].new++;
      continue;
    }

    const classicR1 = cleanTip(classicTalent.ranks[0].description);
    const foreverR1 = cleanTip(talent.ranks[0].description);

    if (normTip(classicR1) === normTip(foreverR1)) {
      next[id] = {
        review: "classic",
        ...(screenshots ? { screenshots } : {}),
      };
      counts.classic++;
      byClass[cls.slug].classic++;
      continue;
    }

    next[id] = {
      review: "updated",
      classicDescription: classicR1,
      ...(screenshots ? { screenshots } : {}),
    };
    counts.updated++;
    byClass[cls.slug].updated++;
    if (updatedSamples.length < 12) {
      updatedSamples.push({
        class: cls.slug,
        name: talent.name,
        classic: classicR1.slice(0, 120),
        forever: foreverR1.slice(0, 120),
      });
    }
  }
}

fs.writeFileSync(reviewPath, `${JSON.stringify(next, null, 2)}\n`);
console.log("totals", counts);
console.log("byClass", byClass);
console.log("updated samples", updatedSamples);
console.log("wrote", reviewPath, "entries", Object.keys(next).length);
