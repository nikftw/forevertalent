"use client";

import { iconUrl } from "@/lib/assets";
import {
  PROFESSIONS,
  RACES,
  getProfession,
  getRace,
} from "@/lib/extras";
import type { ExtrasSelection } from "@/data/types";
import {
  ProfessionAbilityPanel,
  RaceAbilityPanel,
} from "@/components/ExtraAbilityPanels";

type ExtrasSelectProps = {
  selection: ExtrasSelection;
  onChange: (next: ExtrasSelection) => void;
};

export function ExtrasSelect({ selection, onChange }: ExtrasSelectProps) {
  const race = getRace(selection.race);
  const p1 = getProfession(selection.p1);
  const p2 = getProfession(selection.p2);

  function setRace(slug: string | null) {
    onChange({ ...selection, race: slug });
  }

  function setProfession(slot: "p1" | "p2", slug: string | null) {
    const next = { ...selection, [slot]: slug };
    if (slot === "p1" && slug && slug === next.p2) next.p2 = null;
    if (slot === "p2" && slug && slug === next.p1) return;
    onChange(next);
  }

  return (
    <section className="extras" aria-label="Race and professions">
      <div className="extras-controls">
        <div className="extras-group">
          <span className="extras-label">Race</span>
          <div className="extras-icons" role="listbox" aria-label="Race">
            {RACES.map((entry) => {
              const active = selection.race === entry.slug;
              return (
                <button
                  key={entry.slug}
                  type="button"
                  role="option"
                  aria-selected={active}
                  title={entry.name}
                  className={
                    active ? "extra-icon is-active" : "extra-icon"
                  }
                  data-faction={entry.faction}
                  onClick={() => setRace(active ? null : entry.slug)}
                >
                  <img
                    src={iconUrl(entry.icon, "medium")}
                    alt={entry.name}
                    width={32}
                    height={32}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="extras-group">
          <span className="extras-label">Profession 1</span>
          <div className="extras-icons" role="listbox" aria-label="Profession 1">
            {PROFESSIONS.map((entry) => {
              const active = selection.p1 === entry.slug;
              const taken = selection.p2 === entry.slug;
              return (
                <button
                  key={entry.slug}
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={taken}
                  title={
                    taken ? `${entry.name} (already Profession 2)` : entry.name
                  }
                  className={
                    active
                      ? "extra-icon is-active"
                      : taken
                        ? "extra-icon is-disabled"
                        : "extra-icon"
                  }
                  onClick={() => setProfession("p1", active ? null : entry.slug)}
                >
                  <img
                    src={iconUrl(entry.icon, "medium")}
                    alt={entry.name}
                    width={32}
                    height={32}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="extras-group">
          <span className="extras-label">Profession 2</span>
          <div className="extras-icons" role="listbox" aria-label="Profession 2">
            {PROFESSIONS.map((entry) => {
              const active = selection.p2 === entry.slug;
              const taken = selection.p1 === entry.slug;
              return (
                <button
                  key={entry.slug}
                  type="button"
                  role="option"
                  aria-selected={active}
                  disabled={taken}
                  title={
                    taken ? `${entry.name} (already Profession 1)` : entry.name
                  }
                  className={
                    active
                      ? "extra-icon is-active"
                      : taken
                        ? "extra-icon is-disabled"
                        : "extra-icon"
                  }
                  onClick={() => setProfession("p2", active ? null : entry.slug)}
                >
                  <img
                    src={iconUrl(entry.icon, "medium")}
                    alt={entry.name}
                    width={32}
                    height={32}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {race || p1 || p2 ? (
        <div className="extras-panels">
          {race ? <RaceAbilityPanel race={race} /> : null}
          {p1 ? (
            <ProfessionAbilityPanel profession={p1} slotLabel="Profession 1" />
          ) : null}
          {p2 ? (
            <ProfessionAbilityPanel profession={p2} slotLabel="Profession 2" />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
