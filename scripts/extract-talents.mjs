import fs from "node:fs";
import path from "node:path";

const source = path.resolve(
  "C:/Users/Shane/.cursor/browser-logs/cdp-response-Runtime.evaluate-2026-09-12T20-23-35-575Z.json",
);
const raw = JSON.parse(fs.readFileSync(source, "utf8")).result.value;
const data = JSON.parse(raw);

const TREE_ORDER = {
  warrior: [161, 164, 163],
  paladin: [382, 383, 381],
  hunter: [361, 363, 362],
  rogue: [182, 181, 183],
  priest: [201, 202, 203],
  shaman: [261, 263, 262],
  mage: [81, 41, 61],
  warlock: [302, 303, 301],
  druid: [283, 281, 282],
};

const TREE_ICONS = {
  161: "ability_rogue_eviscerate",
  164: "ability_warrior_innerrage",
  163: "inv_shield_06",
  382: "spell_holy_holybolt",
  383: "spell_holy_devotionaura",
  381: "spell_holy_auraoflight",
  361: "ability_hunter_beasttaming",
  363: "ability_marksmanship",
  362: "ability_hunter_swiftstrike",
  182: "ability_rogue_eviscerate",
  181: "ability_backstab",
  183: "ability_stealth",
  201: "spell_holy_wordfortitude",
  202: "spell_holy_holybolt",
  203: "spell_shadow_shadowwordpain",
  261: "spell_nature_lightning",
  263: "spell_nature_lightningshield",
  262: "spell_nature_magicimmunity",
  81: "spell_holy_magicalsentry",
  41: "spell_fire_firebolt02",
  61: "spell_frost_frostbolt02",
  302: "spell_shadow_deathcoil",
  303: "spell_shadow_metamorphosis",
  301: "spell_shadow_rainoffire",
  283: "spell_nature_starfall",
  281: "ability_racial_bearform",
  282: "spell_nature_healingtouch",
};

const CLASS_ORDER = [
  "warrior",
  "paladin",
  "hunter",
  "rogue",
  "priest",
  "shaman",
  "mage",
  "warlock",
  "druid",
];

const bySlug = Object.fromEntries(data.classes.map((cls) => [cls.slug, cls]));

const classes = CLASS_ORDER.map((slug) => {
  const cls = bySlug[slug];
  const order = TREE_ORDER[slug];
  cls.trees = [...cls.trees]
    .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
    .map((tree) => ({
      ...tree,
      icon: TREE_ICONS[tree.id],
    }));
  return cls;
});

const out = { maxPoints: 51, classes };
const dest = path.resolve("src/data/talents.json");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out, null, 2));

for (const cls of classes) {
  console.log(
    `${cls.slug}: ${cls.trees.map((t) => `${t.name}(${t.talents.length})`).join(" | ")}`,
  );
}
console.log("wrote", dest, fs.statSync(dest).size, "bytes");
