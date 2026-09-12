export type RankTooltip = {
  spellId: number;
  name: string;
  description: string;
};

export type TalentRequirement = {
  id: number;
  qty: number;
};

export type Talent = {
  id: number;
  row: number;
  col: number;
  icon: string;
  maxRank: number;
  requires: TalentRequirement[];
  name: string;
  ranks: RankTooltip[];
};

export type TalentTree = {
  id: number;
  name: string;
  icon: string;
  talents: Talent[];
};

export type PlayerClass = {
  id: number;
  name: string;
  slug: string;
  color: string;
  icon: string;
  trees: TalentTree[];
};

export type TalentDataset = {
  source: string;
  note: string;
  maxPoints: number;
  classes: PlayerClass[];
};

export type RankState = Record<number, number>;

export type TalentAction =
  | { type: "learn"; talentId: number }
  | { type: "unlearn"; talentId: number }
  | { type: "max"; talentId: number }
  | { type: "clear"; talentId: number }
  | { type: "reset-tree"; treeId: number }
  | { type: "reset-all" };
