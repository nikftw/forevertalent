"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { iconUrl } from "@/lib/assets";
import { reviewLabel, talentReview } from "@/lib/review";
import {
  canLearn,
  canUnlearn,
  formatTooltip,
  rankOf,
  talentAvailability,
} from "@/lib/talents";
import type { PlayerClass, RankState, Talent } from "@/data/types";

type TalentNodeProps = {
  cls: PlayerClass;
  talent: Talent;
  ranks: RankState;
  onLearn: () => void;
  onUnlearn: () => void;
  onMax: () => void;
  onClear: () => void;
};

type TooltipPos = {
  top: number;
  left: number;
};

export function TalentNode({
  cls,
  talent,
  ranks,
  onLearn,
  onUnlearn,
  onMax,
  onClear,
}: TalentNodeProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<TooltipPos | null>(null);
  const current = rankOf(ranks, talent.id);
  const availability = talentAvailability(cls, ranks, talent);
  const learnable = canLearn(cls, ranks, talent.id);
  const unlearnable = canUnlearn(cls, ranks, talent.id);
  const currentRank =
    current === 0 ? talent.ranks[0] : talent.ranks[current - 1];
  const nextRank =
    current > 0 && current < talent.maxRank ? talent.ranks[current] : undefined;
  const review = talentReview(talent);

  useLayoutEffect(() => {
    if (!open || !slotRef.current) {
      setPos(null);
      return;
    }

    function update() {
      const slot = slotRef.current;
      if (!slot) return;
      const rect = slot.getBoundingClientRect();
      setPos({ top: rect.bottom - 12, left: rect.right - 12 });
    }

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const tooltip =
    open && currentRank && pos
      ? createPortal(
          <div
            className="talent-tooltip"
            role="tooltip"
            style={{ top: pos.top, left: pos.left }}
          >
            <div className="tooltip-head">
              <strong>{talent.name}</strong>
              <span>
                Rank {current}/{talent.maxRank}
              </span>
            </div>
            <p>{formatTooltip(currentRank.description)}</p>
            {nextRank ? (
              <>
                <div className="tooltip-next">Next rank:</div>
                <p>{formatTooltip(nextRank.description)}</p>
              </>
            ) : null}
            {learnable ? <div className="tooltip-hint">Click to learn</div> : null}
            {unlearnable ? (
              <div className="tooltip-hint">Right-click to unlearn</div>
            ) : null}
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      ref={slotRef}
      className="talent-slot"
      style={{ gridColumn: talent.col + 1, gridRow: talent.row + 1 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`talent-node is-${availability}`}
        aria-label={`${talent.name} ${current}/${talent.maxRank}, ${reviewLabel(review)}`}
        onClick={(event) => {
          if (event.shiftKey) onMax();
          else onLearn();
        }}
        onContextMenu={(event) => {
          event.preventDefault();
          if (event.shiftKey) onClear();
          else onUnlearn();
        }}
      >
        <img
          src={iconUrl(talent.icon)}
          alt=""
          width={40}
          height={40}
          draggable={false}
        />
        <span className={`talent-review is-${review}`} />
        <span className="talent-rank">
          {current}/{talent.maxRank}
        </span>
      </button>
      {tooltip}
    </div>
  );
}
