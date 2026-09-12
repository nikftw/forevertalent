import type {
  PlayerClass,
  RankState,
  Talent,
  TalentAction,
  TalentTree,
} from "@/data/types";
import { MAX_POINTS } from "@/lib/classes";

export function orderedTalents(tree: TalentTree): Talent[] {
  return [...tree.talents].sort((a, b) => a.row - b.row || a.col - b.col);
}

export function rankOf(ranks: RankState, talentId: number): number {
  return ranks[talentId] ?? 0;
}

export function treePoints(tree: TalentTree, ranks: RankState): number {
  return tree.talents.reduce((sum, talent) => sum + rankOf(ranks, talent.id), 0);
}

export function classPoints(cls: PlayerClass, ranks: RankState): number {
  return cls.trees.reduce((sum, tree) => sum + treePoints(tree, ranks), 0);
}

export function pointsInLowerTiers(
  tree: TalentTree,
  ranks: RankState,
  row: number,
): number {
  return tree.talents.reduce((sum, talent) => {
    if (talent.row >= row) return sum;
    return sum + rankOf(ranks, talent.id);
  }, 0);
}

export function findTalent(
  cls: PlayerClass,
  talentId: number,
): { tree: TalentTree; talent: Talent } | null {
  for (const tree of cls.trees) {
    const talent = tree.talents.find((item) => item.id === talentId);
    if (talent) return { tree, talent };
  }
  return null;
}

export function requirementsMet(
  talent: Talent,
  ranks: RankState,
): boolean {
  return talent.requires.every((req) => rankOf(ranks, req.id) >= req.qty);
}

export function isTalentUnlocked(
  tree: TalentTree,
  talent: Talent,
  ranks: RankState,
): boolean {
  return (
    pointsInLowerTiers(tree, ranks, talent.row) >= talent.row * 5 &&
    requirementsMet(talent, ranks)
  );
}

export function isStateLegal(cls: PlayerClass, ranks: RankState): boolean {
  if (classPoints(cls, ranks) > MAX_POINTS) return false;
  for (const tree of cls.trees) {
    for (const talent of tree.talents) {
      const current = rankOf(ranks, talent.id);
      if (current === 0) continue;
      if (current > talent.maxRank) return false;
      if (!isTalentUnlocked(tree, talent, ranks)) return false;
    }
  }
  return true;
}

export function canLearn(
  cls: PlayerClass,
  ranks: RankState,
  talentId: number,
): boolean {
  const found = findTalent(cls, talentId);
  if (!found) return false;
  const { tree, talent } = found;
  if (classPoints(cls, ranks) >= MAX_POINTS) return false;
  if (rankOf(ranks, talent.id) >= talent.maxRank) return false;
  return isTalentUnlocked(tree, talent, ranks);
}

export function canUnlearn(
  cls: PlayerClass,
  ranks: RankState,
  talentId: number,
): boolean {
  const current = rankOf(ranks, talentId);
  if (current <= 0) return false;
  const next = { ...ranks, [talentId]: current - 1 };
  if (next[talentId] <= 0) delete next[talentId];
  return isStateLegal(cls, next);
}

export function applyAction(
  cls: PlayerClass,
  ranks: RankState,
  action: TalentAction,
): RankState {
  switch (action.type) {
    case "learn": {
      if (!canLearn(cls, ranks, action.talentId)) return ranks;
      return {
        ...ranks,
        [action.talentId]: rankOf(ranks, action.talentId) + 1,
      };
    }
    case "unlearn": {
      if (!canUnlearn(cls, ranks, action.talentId)) return ranks;
      const next = { ...ranks };
      const remaining = rankOf(ranks, action.talentId) - 1;
      if (remaining <= 0) delete next[action.talentId];
      else next[action.talentId] = remaining;
      return next;
    }
    case "max": {
      let next = ranks;
      while (canLearn(cls, next, action.talentId)) {
        next = applyAction(cls, next, {
          type: "learn",
          talentId: action.talentId,
        });
      }
      return next;
    }
    case "clear": {
      let next = ranks;
      while (canUnlearn(cls, next, action.talentId)) {
        next = applyAction(cls, next, {
          type: "unlearn",
          talentId: action.talentId,
        });
      }
      return next;
    }
    case "reset-tree": {
      const tree = cls.trees.find((item) => item.id === action.treeId);
      if (!tree) return ranks;
      const next = { ...ranks };
      for (const talent of tree.talents) delete next[talent.id];
      return next;
    }
    case "reset-all":
      return {};
    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}

export function encodeBuild(cls: PlayerClass, ranks: RankState): string {
  let encoded = "";
  for (const tree of cls.trees) {
    for (const talent of orderedTalents(tree)) {
      encoded += String(rankOf(ranks, talent.id));
    }
  }
  return encoded.replace(/0+$/, "");
}

export function decodeBuild(cls: PlayerClass, code: string): RankState {
  const ranks: RankState = {};
  let index = 0;
  for (const tree of cls.trees) {
    for (const talent of orderedTalents(tree)) {
      const digit = code[index++];
      const value = digit ? Number.parseInt(digit, 10) : 0;
      if (!Number.isFinite(value) || value <= 0) continue;
      ranks[talent.id] = Math.min(talent.maxRank, value);
    }
  }
  return sanitizeRanks(cls, ranks);
}

export function sanitizeRanks(cls: PlayerClass, ranks: RankState): RankState {
  const next = { ...ranks };
  let changed = true;
  while (changed) {
    changed = false;
    for (const tree of cls.trees) {
      for (const talent of [...tree.talents].sort((a, b) => b.row - a.row)) {
        while (rankOf(next, talent.id) > 0 && !isTalentUnlocked(tree, talent, next)) {
          const remaining = rankOf(next, talent.id) - 1;
          if (remaining <= 0) delete next[talent.id];
          else next[talent.id] = remaining;
          changed = true;
        }
      }
    }
    while (classPoints(cls, next) > MAX_POINTS) {
      const spent = Object.entries(next).find(([, value]) => value > 0);
      if (!spent) break;
      const talentId = Number(spent[0]);
      const remaining = spent[1] - 1;
      if (remaining <= 0) delete next[talentId];
      else next[talentId] = remaining;
      changed = true;
    }
  }
  return next;
}

export function formatTooltip(raw: string): string {
  return raw
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

export function talentAvailability(
  cls: PlayerClass,
  ranks: RankState,
  talent: Talent,
): "locked" | "available" | "active" | "maxed" {
  const current = rankOf(ranks, talent.id);
  if (current >= talent.maxRank) return "maxed";
  if (current > 0) return "active";
  const found = findTalent(cls, talent.id);
  if (!found) return "locked";
  if (isTalentUnlocked(found.tree, talent, ranks) && classPoints(cls, ranks) < MAX_POINTS) {
    return "available";
  }
  return "locked";
}
