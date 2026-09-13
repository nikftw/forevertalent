import talentData from "@/data/talents.json";
import reviewStatus from "@/data/review-status.json";
import type { PlayerClass, TalentDataset, TalentReview } from "@/data/types";

const data = talentData as TalentDataset;

type ReviewEntry = {
  review: TalentReview;
  screenshots?: string[];
  classicDescription?: string;
};

const reviews = reviewStatus as Record<string, ReviewEntry>;

export const MAX_POINTS = data.maxPoints;

export const CLASSES: PlayerClass[] = data.classes.map((cls) => ({
  ...cls,
  trees: cls.trees.map((tree) => ({
    ...tree,
    talents: tree.talents.map((talent) => {
      const entry = reviews[String(talent.id)];
      return {
        ...talent,
        review: entry?.review ?? talent.review ?? "classic",
        classicDescription:
          entry?.classicDescription ?? talent.classicDescription,
      };
    }),
  })),
}));

export function getClass(slug: string): PlayerClass | undefined {
  return CLASSES.find((cls) => cls.slug === slug);
}

export function isClassSlug(slug: string): boolean {
  return CLASSES.some((cls) => cls.slug === slug);
}

/** Per-class point cap (Legacy Points, etc.), falling back to the dataset default. */
export function maxPointsFor(cls: PlayerClass): number {
  return cls.maxPoints ?? MAX_POINTS;
}

export function pointsPerTierFor(cls: PlayerClass): number {
  return cls.pointsPerTier ?? 5;
}

export function pointsLabelFor(cls: PlayerClass): string {
  return cls.pointsLabel ?? "Points left";
}
