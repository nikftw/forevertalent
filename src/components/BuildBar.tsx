"use client";

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
 * The build readout. Sits between the extras and the trees at a fixed width so
 * it never moves when a race or profession panel opens.
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

      {spent > 0 ? (
        <button
          type="button"
          className="build-reset"
          onClick={onReset}
          title="Reset all points"
          aria-label="Reset all points"
        >
          &times;
        </button>
      ) : null}

      <span className={remaining === 0 ? "build-points is-done" : "build-points"}>
        <span className="build-points-label">Points left</span>
        <span className="build-points-value">{remaining}</span>
      </span>

      <button type="button" className="build-share" onClick={onCopy}>
        {copied ? "Link copied" : "Copy build link"}
      </button>
    </div>
  );
}
