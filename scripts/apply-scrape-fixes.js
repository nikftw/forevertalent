const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const data = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/talents.json"), "utf8"),
);
const review = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/review-status.json"), "utf8"),
);

function getClass(slug) {
  return data.classes.find((c) => c.slug === slug);
}
function getTree(cls, name) {
  return cls.trees.find((t) => t.name === name);
}
function findAt(tree, row, col) {
  return tree.talents.find((t) => t.row === row && t.col === col);
}
function findByName(tree, name) {
  return tree.talents.find((t) => t.name === name);
}

let nextId = 90001;
for (const cls of data.classes) {
  for (const tree of cls.trees) {
    for (const t of tree.talents) {
      if (t.id >= nextId) nextId = t.id + 1;
    }
  }
}

const log = [];

function replaceOrAdd(clsSlug, treeName, row, col, talentDef, removeNames = []) {
  const cls = getClass(clsSlug);
  const tree = getTree(cls, treeName);
  for (const n of removeNames) {
    const i = tree.talents.findIndex((t) => t.name === n);
    if (i >= 0) {
      const removed = tree.talents.splice(i, 1)[0];
      delete review[String(removed.id)];
      log.push(`removed ${clsSlug}:${n}`);
    }
  }
  const existing = findAt(tree, row, col);
  if (existing && existing.name !== talentDef.name) {
    delete review[String(existing.id)];
    tree.talents = tree.talents.filter((t) => t.id !== existing.id);
    log.push(`replaced slot ${existing.name} with ${talentDef.name}`);
  }
  let t = findByName(tree, talentDef.name);
  if (!t) {
    const id = nextId++;
    t = {
      id,
      row,
      col,
      icon: talentDef.icon || "inv_misc_questionmark",
      maxRank: talentDef.ranks.length,
      requires: talentDef.requires || [],
      name: talentDef.name,
      ranks: talentDef.ranks.map((d, i) => ({
        spellId: id * 10 + i,
        name: talentDef.name,
        description: d,
      })),
    };
    tree.talents.push(t);
    log.push(`added ${talentDef.name} #${t.id}`);
  } else {
    t.row = row;
    t.col = col;
    t.maxRank = talentDef.ranks.length;
    t.ranks = talentDef.ranks.map((d, i) => ({
      spellId: t.ranks[i]?.spellId ?? t.id * 10 + i,
      name: talentDef.name,
      description: d,
    }));
    log.push(`updated existing ${talentDef.name}`);
  }
  review[String(t.id)] = {
    review: "new",
    screenshots: talentDef.screenshots || [],
  };
}

replaceOrAdd(
  "warrior",
  "Protection",
  2,
  1,
  {
    name: "Master of Defense",
    screenshots: ["warrior/image.png"],
    ranks: [
      "Grants you a 50% chance to generate 5 Rage when you Dodge or Parry while a shield is equipped.",
      "Grants you a 100% chance to generate 5 Rage when you Dodge or Parry while a shield is equipped.",
    ],
  },
  ["Improved Shield Block"],
);

replaceOrAdd(
  "warrior",
  "Protection",
  3,
  2,
  {
    name: "Vanguard",
    screenshots: ["warrior/image.png"],
    ranks: ["Your Charge ability is now usable while in Defensive Stance."],
  },
  ["Improved Taunt"],
);

replaceOrAdd(
  "warrior",
  "Protection",
  5,
  2,
  {
    name: "Bastion",
    screenshots: ["warrior/image.png"],
    ranks: [
      "Increases all damage you deal by 2% while a shield is equipped.",
      "Increases all damage you deal by 4% while a shield is equipped.",
      "Increases all damage you deal by 6% while a shield is equipped.",
      "Increases all damage you deal by 8% while a shield is equipped.",
      "Increases all damage you deal by 10% while a shield is equipped.",
    ],
  },
  ["One-Handed Weapon Specialization"],
);

{
  const frost = getTree(getClass("mage"), "Frost");
  const impCone = findByName(frost, "Improved Cone of Cold");
  if (impCone && impCone.row === 4 && impCone.col === 2) {
    if (!findAt(frost, 4, 0)) {
      impCone.row = 4;
      impCone.col = 0;
      log.push("moved Improved Cone of Cold to 4,0");
    }
  }
  replaceOrAdd("mage", "Frost", 4, 2, {
    name: "Fingers of Frost",
    screenshots: ["mage/49.png"],
    icon: "ability_mage_wintersgrasp",
    ranks: [
      "Gives your Chill effects a 15% chance to grant you the Fingers of Frost effect, which treats your next 1 spell cast as if the target were Frozen. Lasts 15 sec.",
      "Gives your Chill effects a 30% chance to grant you the Fingers of Frost effect, which treats your next 1 spell cast as if the target were Frozen. Lasts 15 sec.",
    ],
  });
}

{
  const mage = getClass("mage");
  const arcane = getTree(mage, "Arcane");
  const ma = arcane.talents.find((t) => t.id === 1650);
  if (ma) {
    ma.maxRank = 2;
    ma.ranks = [
      {
        spellId: ma.ranks[0]?.spellId ?? 29441,
        name: "Magic Absorption",
        description:
          "Increases all your resistances by 5 and causes all spells you fully resist to restore 1% of your total mana. Cannot trigger more often than 1 time per sec.",
      },
      {
        spellId: ma.ranks[1]?.spellId ?? 29444,
        name: "Magic Absorption",
        description:
          "Increases all your resistances by 10 and causes all spells you fully resist to restore 2% of your total mana. Cannot trigger more often than 1 time per sec.",
      },
    ];
    review["1650"] = { review: "updated", screenshots: ["mage/5.png"] };
    log.push("fixed Magic Absorption -> updated");
  }
  const am = arcane.talents.find((t) => t.id === 77);
  if (am) {
    am.ranks = [2, 4, 6, 8, 10].map((pct, i) => ({
      spellId: am.ranks[i]?.spellId ?? 11232 + i,
      name: "Arcane Mind",
      description: `Increases your Intellect by ${pct}% and increases the critical strike damage bonus of your Arcane spells by ${pct * 10}%.`,
    }));
    review["77"] = { review: "updated", screenshots: ["mage/6.png"] };
    log.push("fixed Arcane Mind -> updated");
  }
  const asub = arcane.talents.find((t) => t.id === 74);
  if (asub?.ranks[0] && asub?.ranks[1]) {
    asub.ranks[0].description =
      "Reduces your target's resistance to all your spells by 8 and reduces the threat caused by your Arcane spells by 15%.";
    asub.ranks[1].description =
      "Reduces your target's resistance to all your spells by 15 and reduces the threat caused by your Arcane spells by 30%.";
    review["74"] = { review: "updated", screenshots: ["mage/2.png"] };
    log.push("fixed Arcane Subtlety rank texts");
  }
}

fs.writeFileSync(
  path.join(root, "src/data/talents.json"),
  JSON.stringify(data, null, 2) + "\n",
);
fs.writeFileSync(
  path.join(root, "src/data/review-status.json"),
  JSON.stringify(review, null, 2) + "\n",
);
console.log(log.join("\n"));
console.log("review keys", Object.keys(review).length);
