import type { Talent, TalentReview } from "@/data/types";

export function talentReview(talent: Talent): TalentReview {
  return talent.review ?? "classic";
}

export function reviewLabel(review: TalentReview): string {
  switch (review) {
    case "classic":
      return "Classic";
    case "unchanged":
      return "Unchanged";
    case "updated":
      return "Updated";
    case "new":
      return "New";
    default: {
      const exhaustive: never = review;
      return exhaustive;
    }
  }
}

export const REVIEW_LEGEND: TalentReview[] = [
  "new",
  "updated",
  "unchanged",
  "classic",
];
