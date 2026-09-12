import talentData from "@/data/talents.json";
import reviewStatus from "@/data/review-status.json";
import type { PlayerClass, TalentDataset, TalentReview } from "@/data/types";

const data = talentData as TalentDataset;

type ReviewEntry = {
  review: TalentReview;
  screenshots?: string[];
};

const reviews = reviewStatus as Record<string, ReviewEntry>;

export const MAX_POINTS = data.maxPoints;

export const CLASSES: PlayerClass[] = data.classes.map((cls) => ({
  ...cls,
  trees: cls.trees.map((tree) => ({
    ...tree,
    talents: tree.talents.map((talent) => ({
      ...talent,
      review: reviews[String(talent.id)]?.review ?? talent.review ?? "classic",
    })),
  })),
}));

export function getClass(slug: string): PlayerClass | undefined {
  return CLASSES.find((cls) => cls.slug === slug);
}

export function isClassSlug(slug: string): boolean {
  return CLASSES.some((cls) => cls.slug === slug);
}
