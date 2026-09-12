import talentData from "@/data/talents.json";
import type { PlayerClass, TalentDataset } from "@/data/types";

const data = talentData as TalentDataset;

export const MAX_POINTS = data.maxPoints;
export const CLASSES = data.classes;

export function getClass(slug: string): PlayerClass | undefined {
  return CLASSES.find((cls) => cls.slug === slug);
}

export function isClassSlug(slug: string): boolean {
  return CLASSES.some((cls) => cls.slug === slug);
}
