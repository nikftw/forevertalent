"use client";

import { useEffect, useState } from "react";
import { BuildBar } from "@/components/BuildBar";
import { ClassSelect } from "@/components/ClassSelect";
import { ExtrasControls, ExtrasPanels } from "@/components/ExtrasSelect";
import { ReviewLegend } from "@/components/ReviewLegend";
import { SiteFooter } from "@/components/SiteFooter";
import { TalentTreeCard } from "@/components/TalentTree";
import { withBasePath } from "@/lib/basePath";
import { CLASSES, maxPointsFor } from "@/lib/classes";
import {
  parseExtrasForClass,
  sanitizeExtrasForClass,
  serializeExtras,
} from "@/lib/extras";
import {
  applyAction,
  classPoints,
  decodeBuild,
  encodeBuild,
  treePoints,
} from "@/lib/talents";
import type { ExtrasSelection, PlayerClass, RankState } from "@/data/types";

type TalentCalculatorProps = {
  cls: PlayerClass;
  initialBuild: string;
};

const EMPTY_EXTRAS: ExtrasSelection = {
  race: null,
  p1: null,
  p2: null,
};

export function TalentCalculator({ cls, initialBuild }: TalentCalculatorProps) {
  const [ranks, setRanks] = useState<RankState>(() =>
    decodeBuild(cls, initialBuild),
  );
  const [extras, setExtras] = useState<ExtrasSelection>(EMPTY_EXTRAS);
  const [urlReady, setUrlReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const spent = classPoints(cls, ranks);
  const remaining = maxPointsFor(cls) - spent;
  const split = cls.trees.map((tree) => treePoints(tree, ranks));
  const build = encodeBuild(cls, ranks);
  const extrasQuery = serializeExtras(extras);

  useEffect(() => {
    setExtras(parseExtrasForClass(window.location.search, cls.slug));
    setUrlReady(true);
  }, [cls.slug]);

  useEffect(() => {
    if (!urlReady) return;
    const hash = window.location.hash.replace(/^#/, "");
    if (hash && !build) {
      setRanks(decodeBuild(cls, hash));
      return;
    }
    const nextPath = build
      ? withBasePath(`/${cls.slug}/${build}`)
      : withBasePath(`/${cls.slug}/`);
    const nextUrl = `${nextPath}${extrasQuery}`;
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== nextUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [build, cls, extrasQuery, urlReady]);

  function update(next: RankState) {
    setRanks(next);
    setCopied(false);
  }

  function updateExtras(next: ExtrasSelection) {
    setExtras(sanitizeExtrasForClass(next, cls.slug));
    setCopied(false);
  }

  async function copyBuild() {
    const path = build
      ? withBasePath(`/${cls.slug}/${build}`)
      : withBasePath(`/${cls.slug}/`);
    const url = `${window.location.origin}${path}${extrasQuery}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  return (
    <div className="calculator">
      <header className="masthead">
        <div className="masthead-selectors">
          <div className="extras-group extras-group-class">
            <span className="extras-label" id="extras-class-label">
              Class
            </span>
            <ClassSelect
              classes={CLASSES}
              activeSlug={cls.slug}
              extras={extras}
            />
          </div>
          <ExtrasControls
            classSlug={cls.slug}
            selection={extras}
            onChange={updateExtras}
          />
        </div>
        <BuildBar
          cls={cls}
          split={split}
          spent={spent}
          remaining={remaining}
          copied={copied}
          onReset={() => update(applyAction(cls, ranks, { type: "reset-all" }))}
          onCopy={copyBuild}
        />
      </header>
      <ExtrasPanels selection={extras} />
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
              update(
                applyAction(cls, ranks, { type: "reset-tree", treeId: tree.id }),
              )
            }
          />
        ))}
      </div>
      <ReviewLegend />
      <SiteFooter />
    </div>
  );
}
