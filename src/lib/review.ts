import type { Talent, TalentReview } from "@/data/types";

export function talentReview(talent: Talent): TalentReview {
  return talent.review ?? "classic";
}

export function reviewLabel(review: TalentReview): string {
  switch (review) {
    case "classic":
      return "Same";
    case "unchanged":
      return "Same";
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

/** Corner dots: red new / orange updated / grey same. Green unused after Classic name pass. */
export const REVIEW_LEGEND: TalentReview[] = ["new", "updated", "classic"];
