"use client";

import Link from "next/link";
import { classIconUrl } from "@/lib/assets";
import type { PlayerClass } from "@/data/types";

type ClassSelectProps = {
  classes: PlayerClass[];
  activeSlug: string;
  query?: string;
};

export function ClassSelect({
  classes,
  activeSlug,
  query = "",
}: ClassSelectProps) {
  return (
    <nav className="class-select" aria-label="Classes">
      {classes.map((cls) => {
        const active = cls.slug === activeSlug;
        return (
          <Link
            key={cls.slug}
            href={`/${cls.slug}${query}`}
            title={cls.name}
            className={active ? "class-icon is-active" : "class-icon"}
            style={{ ["--class-color" as string]: cls.color }}
          >
            <img src={classIconUrl(cls.icon)} alt={cls.name} width={36} height={36} />
          </Link>
        );
      })}
    </nav>
  );
}
