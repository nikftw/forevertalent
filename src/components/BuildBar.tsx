"use client";

import { pointsLabelFor } from "@/lib/classes";
import type { PlayerClass } from "@/data/types";

type BuildBarProps = {
  cls: PlayerClass;
  /** Points in each tree, in tree order. */
  split: number[];
  spent: number;
  remaining: number;
  copied: boolean;
  onReset: () => void;
  onCopy: () => void;
};

/**
 * Build readout. Lives in the masthead top-right and stretches to match the
 * Class / Race / Profs selector rows.
 */
export function BuildBar({
  cls,
  split,
  spent,
  remaining,
  copied,
  onReset,
  onCopy,
}: BuildBarProps) {
  return (
    <div className="build-bar">
      <span className="build-class" style={{ color: cls.color }}>
        {cls.name}
      </span>

      <span className="build-split" aria-label="Points per tree">
        {split.map((points, index) => (
          <span key={cls.trees[index]?.id ?? index}>
            {index > 0 ? <i aria-hidden>/</i> : null}
            <b className={points > 0 ? "is-spent" : undefined}>{points}</b>
          </span>
        ))}
      </span>

      <span className={remaining === 0 ? "build-points is-done" : "build-points"}>
        <span className="build-points-label">{pointsLabelFor(cls)}</span>
        <span className="build-points-value">{remaining}</span>
      </span>

      <div className="build-actions">
        <button
          type="button"
          className="build-reset"
          onClick={onReset}
          disabled={spent === 0}
          title="Reset all points"
        >
          Reset
        </button>
        <button type="button" className="build-share" onClick={onCopy}>
          {copied ? "Link copied" : "Copy build link"}
        </button>
      </div>
    </div>
  );
}
