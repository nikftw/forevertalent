"use client";

import { iconUrl, treeBackgroundUrl } from "@/lib/assets";
import { rankOf, treePoints } from "@/lib/talents";
import type { PlayerClass, RankState, Talent, TalentTree } from "@/data/types";
import { TalentNode } from "@/components/TalentNode";

type TalentTreeCardProps = {
  cls: PlayerClass;
  tree: TalentTree;
  ranks: RankState;
  onLearn: (talentId: number) => void;
  onUnlearn: (talentId: number) => void;
  onMax: (talentId: number) => void;
  onClear: (talentId: number) => void;
  onReset: () => void;
};

export function TalentTreeCard({
  cls,
  tree,
  ranks,
  onLearn,
  onUnlearn,
  onMax,
  onClear,
  onReset,
}: TalentTreeCardProps) {
  const spent = treePoints(tree, ranks);
  const byId = new Map(tree.talents.map((talent) => [talent.id, talent]));

  return (
    <section className="tree-card" data-class={cls.slug}>
      <header className="tree-header">
        <span className="tree-spec">
          <img src={iconUrl(tree.icon, "medium")} alt="" width={18} height={18} />
          <span>
            {tree.name} (<span className="tree-spent">{spent}</span>)
          </span>
        </span>
        <button
          type="button"
          className="tree-reset"
          onClick={onReset}
          disabled={spent === 0}
          aria-label={`Reset ${tree.name}`}
          title={`Reset ${tree.name}`}
        >
          ×
        </button>
      </header>
      <div
        className="tree-grid"
        style={{ backgroundImage: `url(${treeBackgroundUrl(cls.slug, tree.name)})` }}
      >
        {tree.talents.map((talent) => (
          <TalentArrow
            key={`arrow-${talent.id}`}
            talent={talent}
            required={talent.requires[0] ? byId.get(talent.requires[0].id) : undefined}
            requiredMaxed={
              talent.requires[0]
                ? rankOf(ranks, talent.requires[0].id) >= talent.requires[0].qty
                : false
            }
          />
        ))}
        {tree.talents.map((talent) => (
          <TalentNode
            key={talent.id}
            cls={cls}
            talent={talent}
            ranks={ranks}
            onLearn={() => onLearn(talent.id)}
            onUnlearn={() => onUnlearn(talent.id)}
            onMax={() => onMax(talent.id)}
            onClear={() => onClear(talent.id)}
          />
        ))}
      </div>
    </section>
  );
}

function TalentArrow({
  talent,
  required,
  requiredMaxed,
}: {
  talent: Talent;
  required?: Talent;
  requiredMaxed: boolean;
}) {
  if (!required) return null;
  const rowSpan = talent.row - required.row;
  const colSpan = talent.col - required.col;
  if (rowSpan < 0) return null;

  const cell = 60;
  const iconMid = 30;
  const crossThickness = 12;
  const left = required.col * cell + 28;
  const width = Math.abs(colSpan) * cell;
  const isCross = colSpan !== 0;

  // Cross-column links sit on the dependent talent's vertical mid so the
  // stripe meets the icon side-on, not hanging off the bottom of the cell.
  const top = isCross
    ? talent.row * cell + iconMid - crossThickness / 2
    : required.row * cell + 48;
  const height = isCross
    ? crossThickness
    : Math.max(rowSpan * cell - 8, 12);

  return (
    <div
      className={requiredMaxed ? "talent-arrow is-on" : "talent-arrow"}
      style={{
        top,
        left: colSpan >= 0 ? left : left - width,
        height,
        width: width || 4,
      }}
      data-dir={colSpan === 0 ? "down" : colSpan > 0 ? "right" : "left"}
    />
  );
}
