import fs from "node:fs";
import path from "node:path";

const files = [
  ["mage/arcane.jpg", "mage/arcane.jpg"],
  ["mage/fire.jpg", "mage/fire.jpg"],
  ["mage/frost.jpg", "mage/frost.jpg"],
  ["warrior/arms.jpg", "warrior/arms.jpg"],
  ["warrior/fury.jpg", "warrior/fury.jpg"],
  ["warrior/protection.jpg", "warrior/protection.jpg"],
  ["paladin/holy.jpg", "paladin/holy.jpg"],
  ["paladin/protection.jpg", "paladin/protection.jpg"],
  ["paladin/retribution.jpg", "paladin/retribution.jpg"],
  ["hunter/beast-mastery.jpg", "hunter/beast-mastery.jpg"],
  ["hunter/marksmanship.jpg", "hunter/marksmanship.jpg"],
  ["hunter/survival.jpg", "hunter/survival.jpg"],
  ["rogue/assassination.jpg", "rogue/assassination.jpg"],
  ["rogue/combat.jpg", "rogue/combat.jpg"],
  ["rogue/sublety.jpg", "rogue/subtlety.jpg"],
  ["priest/discipline.jpg", "priest/discipline.jpg"],
  ["priest/holy.jpg", "priest/holy.jpg"],
  ["priest/shadow.jpg", "priest/shadow.jpg"],
  ["shaman/elemental.jpg", "shaman/elemental.jpg"],
  ["shaman/enhancement.jpg", "shaman/enhancement.jpg"],
  ["shaman/restoration.jpg", "shaman/restoration.jpg"],
  ["warlock/affliction.jpg", "warlock/affliction.jpg"],
  ["warlock/demonology.jpg", "warlock/demonology.jpg"],
  ["warlock/destruction.jpg", "warlock/destruction.jpg"],
  ["druid/balance.jpg", "druid/balance.jpg"],
  ["druid/feral-combat.jpg", "druid/feral-combat.jpg"],
  ["druid/restoration.jpg", "druid/restoration.jpg"],
];

const root = path.resolve("public/backgrounds");

async function download([src, destRel]) {
  const url = `https://djimovanberlo.github.io/tc-ts/img/background/${src}`;
  const dest = path.join(root, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) {
    console.log("FAIL", src, res.status);
    return;
  }
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log("ok", destRel, fs.statSync(dest).size);
}

await Promise.all(files.map(download));
