"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClassSelect } from "@/components/ClassSelect";
import { ExtrasSelect } from "@/components/ExtrasSelect";
import { ReviewLegend } from "@/components/ReviewLegend";
import { TalentTreeCard } from "@/components/TalentTree";
import { foreverLogoUrl } from "@/lib/assets";
import { withBasePath } from "@/lib/basePath";
import { CLASSES, MAX_POINTS } from "@/lib/classes";
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
  const remaining = MAX_POINTS - spent;
  const split = cls.trees.map((tree) => treePoints(tree, ranks)).join("/");
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
        <Link className="brand-logo" href={`/${cls.slug}${extrasQuery}`}>
          <img
            src={foreverLogoUrl()}
            alt="World of Warcraft Forever"
            width={882}
            height={718}
          />
        </Link>
        <div className="masthead-copy">
          <h1>Talent Calculator</h1>
          <ClassSelect
            classes={CLASSES}
            activeSlug={cls.slug}
            extras={extras}
          />
        </div>
      </header>
      <ReviewLegend />
      <ExtrasSelect
        classSlug={cls.slug}
        selection={extras}
        onChange={updateExtras}
      />
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
      <footer className="calc-footer">
        <p>
          <span style={{ color: cls.color }}>{cls.name}</span> ({split})
          {spent > 0 ? (
            <button
              type="button"
              className="text-reset"
              onClick={() =>
                update(applyAction(cls, ranks, { type: "reset-all" }))
              }
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
