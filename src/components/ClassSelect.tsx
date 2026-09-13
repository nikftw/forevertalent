"use client";

import Link from "next/link";
import { classIconUrl } from "@/lib/assets";
import {
  sanitizeExtrasForClass,
  serializeExtras,
} from "@/lib/extras";
import type { ExtrasSelection, PlayerClass } from "@/data/types";

type ClassSelectProps = {
  classes: PlayerClass[];
  activeSlug: string;
  extras: ExtrasSelection;
};

export function ClassSelect({
  classes,
  activeSlug,
  extras,
}: ClassSelectProps) {
  return (
    <nav className="class-select" aria-label="Classes">
      {classes.map((cls) => {
        const active = cls.slug === activeSlug;
        const query = serializeExtras(
          sanitizeExtrasForClass(extras, cls.slug),
        );
        return (
          <Link
            key={cls.slug}
            href={`/${cls.slug}${query}`}
            title={cls.name}
            className={active ? "class-icon is-active" : "class-icon"}
            style={{ ["--class-color" as string]: cls.color }}
          >
            <img src={classIconUrl(cls.icon)} alt={cls.name} width={28} height={28} />
          </Link>
        );
      })}
    </nav>
  );
}
