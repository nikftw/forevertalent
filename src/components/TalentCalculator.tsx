"use client";

import { useEffect, useState } from "react";
import { ClassSelect } from "@/components/ClassSelect";
import { TalentTreeCard } from "@/components/TalentTree";
import { withBasePath } from "@/lib/basePath";
import { CLASSES, MAX_POINTS } from "@/lib/classes";
import {
  applyAction,
  classPoints,
  decodeBuild,
  encodeBuild,
  treePoints,
} from "@/lib/talents";
import type { PlayerClass, RankState } from "@/data/types";

type TalentCalculatorProps = {
  cls: PlayerClass;
  initialBuild: string;
};

export function TalentCalculator({ cls, initialBuild }: TalentCalculatorProps) {
  const [ranks, setRanks] = useState<RankState>(() =>
    decodeBuild(cls, initialBuild),
  );
  const [copied, setCopied] = useState(false);
  const spent = classPoints(cls, ranks);
  const remaining = MAX_POINTS - spent;
  const split = cls.trees.map((tree) => treePoints(tree, ranks)).join("/");
  const build = encodeBuild(cls, ranks);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && !build) {
      setRanks(decodeBuild(cls, hash));
      return;
    }
    const nextPath = build
      ? withBasePath(`/${cls.slug}/${build}`)
      : withBasePath(`/${cls.slug}/`);
    if (window.location.pathname !== nextPath) {
      window.history.replaceState(null, "", nextPath);
    }
  }, [build, cls]);

  function update(next: RankState) {
    setRanks(next);
    setCopied(false);
  }

  async function copyBuild() {
    const path = build
      ? withBasePath(`/${cls.slug}/${build}`)
      : withBasePath(`/${cls.slug}/`);
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  return (
    <div className="calculator">
      <header className="masthead">
        <p className="brand">World of Warcraft Forever</p>
        <h1>Talent Calculator</h1>
      </header>
      <ClassSelect classes={CLASSES} activeSlug={cls.slug} />
      <div className="trees">
        {cls.trees.map((tree) => (
          <TalentTreeCard
            key={tree.id}
            cls={cls}
            tree={tree}
            ranks={ranks}
            onLearn={(talentId) =>
              update(applyAction(cls, ranks, { type: "learn", talentId }))
            }
            onUnlearn={(talentId) =>
              update(applyAction(cls, ranks, { type: "unlearn", talentId }))
            }
            onMax={(talentId) =>
              update(applyAction(cls, ranks, { type: "max", talentId }))
            }
            onClear={(talentId) =>
              update(applyAction(cls, ranks, { type: "clear", talentId }))
            }
            onReset={() =>
              update(applyAction(cls, ranks, { type: "reset-tree", treeId: tree.id }))
            }
          />
        ))}
      </div>
      <footer className="calc-footer">
        <p>
          <span style={{ color: cls.color }}>{cls.name}</span> ({split})
          {spent > 0 ? (
            <button
              type="button"
              className="text-reset"
              onClick={() => update(applyAction(cls, ranks, { type: "reset-all" }))}
            >
              ×
            </button>
          ) : null}
        </p>
        <p>Points left: {remaining}</p>
        <p>
          Share talent build
          <button type="button" className="share" onClick={copyBuild}>
            {copied ? "copied" : "copy"}
          </button>
        </p>
      </footer>
    </div>
  );
}
