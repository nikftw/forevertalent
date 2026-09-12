"use client";

import { useState } from "react";
import { iconUrl } from "@/lib/assets";
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

export function TalentNode({
  cls,
  talent,
  ranks,
  onLearn,
  onUnlearn,
  onMax,
  onClear,
}: TalentNodeProps) {
  const [open, setOpen] = useState(false);
  const current = rankOf(ranks, talent.id);
  const availability = talentAvailability(cls, ranks, talent);
  const learnable = canLearn(cls, ranks, talent.id);
  const unlearnable = canUnlearn(cls, ranks, talent.id);
  const currentRank =
    current === 0 ? talent.ranks[0] : talent.ranks[current - 1];
  const nextRank =
    current > 0 && current < talent.maxRank ? talent.ranks[current] : undefined;

  return (
    <div
      className="talent-slot"
      style={{ gridColumn: talent.col + 1, gridRow: talent.row + 1 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`talent-node is-${availability}`}
        aria-label={`${talent.name} ${current}/${talent.maxRank}`}
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
        <span className="talent-rank">
          {current}/{talent.maxRank}
        </span>
      </button>
      {open && currentRank ? (
        <div className="talent-tooltip" role="tooltip">
          <div className="tooltip-head">
            <strong>{talent.name}</strong>
            <span>
              Rank {current}/{talent.maxRank}
            </span>
          </div>
          {currentRank ? <p>{formatTooltip(currentRank.description)}</p> : null}
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
        </div>
      ) : null}
    </div>
  );
}
