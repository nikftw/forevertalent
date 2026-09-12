import { getClass } from "../src/lib/classes.ts";
import {
  applyAction,
  canLearn,
  decodeBuild,
  encodeBuild,
  formatTooltip,
} from "../src/lib/talents.ts";

const mage = getClass("mage");
if (!mage) throw new Error("missing mage");

const arcane = mage.trees[0].talents[0];
if (!canLearn(mage, {}, arcane.id)) throw new Error("should learn row 0");

let ranks = applyAction(mage, {}, { type: "learn", talentId: arcane.id });
const code = encodeBuild(mage, ranks);
if (code !== "1") throw new Error(`encode got ${code}`);
if (decodeBuild(mage, code)[arcane.id] !== 1) throw new Error("decode mismatch");

const formatted = formatTooltip(
  "Ice shards<!--ppl10:1:1:1:1-->200<br />Hello <!--singular:sec:secs-->sec<!--singular-->.",
);
if (!formatted.includes("200") || formatted.includes("ppl")) {
  throw new Error(formatted);
}

console.log("engine ok", code, formatted);
