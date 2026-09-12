export type TalentReview = "classic" | "unchanged" | "updated" | "new";

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
  review?: TalentReview;
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

export type Faction = "alliance" | "horde";

export type ExtraAbility = {
  name: string;
  icon: string;
  description: string;
  passive?: boolean;
};

export type RaceInfo = {
  slug: string;
  name: string;
  faction: Faction;
  icon: string;
  description: string;
  /** Class slugs this race may play (Forever race/class matrix). */
  allowedClasses: string[];
  abilities: ExtraAbility[];
};

export type ProfessionInfo = {
  slug: string;
  name: string;
  icon: string;
  bonuses: ExtraAbility[];
};

export type ExtrasSelection = {
  race: string | null;
  p1: string | null;
  p2: string | null;
};
