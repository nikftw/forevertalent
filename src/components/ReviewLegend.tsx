"use client";

import { REVIEW_LEGEND, reviewLabel } from "@/lib/review";
import type { TalentReview } from "@/data/types";

function reviewClass(review: TalentReview): string {
  switch (review) {
    case "classic":
    case "unchanged":
    case "updated":
    case "new":
      return `review-dot is-${review}`;
    default: {
      const exhaustive: never = review;
      return exhaustive;
    }
  }
}

export function ReviewLegend() {
  return (
    <ul className="review-legend" aria-label="Talent review status">
      {REVIEW_LEGEND.map((review) => (
        <li key={review}>
          <span className={reviewClass(review)} aria-hidden />
          {reviewLabel(review)}
        </li>
      ))}
    </ul>
  );
}
