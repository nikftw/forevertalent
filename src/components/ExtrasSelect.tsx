"use client";

import { useRef } from "react";
import { iconUrl } from "@/lib/assets";
import {
  PROFESSIONS,
  getProfession,
  getRace,
  isRaceAllowedForClass,
  racesForClass,
} from "@/lib/extras";
import type { ExtrasSelection } from "@/data/types";
import {
  ProfessionAbilityPanel,
  RaceAbilityPanel,
} from "@/components/ExtraAbilityPanels";

type ExtrasControlsProps = {
  classSlug: string;
  selection: ExtrasSelection;
  onChange: (next: ExtrasSelection) => void;
};

type ProfessionSlot = "p1" | "p2";

/**
 * Race and profession pickers. Stacked under Class in the masthead
 * selectors column.
 */
export function ExtrasControls({
  classSlug,
  selection,
  onChange,
}: ExtrasControlsProps) {
  const lastSlotRef = useRef<ProfessionSlot>("p1");
  const availableRaces = racesForClass(classSlug);

  function setRace(slug: string | null) {
    if (slug && !isRaceAllowedForClass(slug, classSlug)) return;
    onChange({ ...selection, race: slug });
  }

  function toggleProfession(slug: string) {
    const { p1: slot1, p2: slot2 } = selection;

    if (slot1 === slug) {
      onChange({ ...selection, p1: null });
      return;
    }
    if (slot2 === slug) {
      onChange({ ...selection, p2: null });
      return;
    }
    if (!slot1) {
      lastSlotRef.current = "p1";
      onChange({ ...selection, p1: slug });
      return;
    }
    if (!slot2) {
      lastSlotRef.current = "p2";
      onChange({ ...selection, p2: slug });
      return;
    }

    // Both filled: last click replaces the other slot.
    if (lastSlotRef.current === "p1") {
      lastSlotRef.current = "p2";
      onChange({ ...selection, p2: slug });
      return;
    }
    lastSlotRef.current = "p1";
    onChange({ ...selection, p1: slug });
  }

  return (
    <div className="extras-controls">
      <div className="extras-group extras-group-race">
        <span className="extras-label" id="extras-race-label">
          Race
        </span>
        <div
          className="extras-icons"
          role="listbox"
          aria-labelledby="extras-race-label"
        >
          {availableRaces.map((entry) => {
            const active = selection.race === entry.slug;
            const label = entry.slug.startsWith("skyborne-")
              ? `${entry.name} (${entry.faction === "alliance" ? "Alliance" : "Horde"})`
              : entry.name;
            return (
              <button
                key={entry.slug}
                type="button"
                role="option"
                aria-selected={active}
                title={label}
                className={active ? "extra-icon is-active" : "extra-icon"}
                data-faction={entry.faction}
                onClick={() => setRace(active ? null : entry.slug)}
              >
                <img
                  src={iconUrl(entry.icon, "medium")}
                  alt={label}
                  width={26}
                  height={26}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="extras-group extras-group-professions">
        <span className="extras-label" id="extras-prof-label">
          Profs
        </span>
        <div
          className="extras-icons"
          role="listbox"
          aria-labelledby="extras-prof-label"
          aria-multiselectable="true"
        >
          {PROFESSIONS.map((entry) => {
            const active =
              selection.p1 === entry.slug || selection.p2 === entry.slug;
            return (
              <button
                key={entry.slug}
                type="button"
                role="option"
                aria-selected={active}
                title={entry.name}
                className={active ? "extra-icon is-active" : "extra-icon"}
                onClick={() => toggleProfession(entry.slug)}
              >
                <img
                  src={iconUrl(entry.icon, "medium")}
                  alt={entry.name}
                  width={26}
                  height={26}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Racial and profession ability panels. Sits below the masthead. */
export function ExtrasPanels({ selection }: { selection: ExtrasSelection }) {
  const race = getRace(selection.race);
  const p1 = getProfession(selection.p1);
  const p2 = getProfession(selection.p2);
  if (!race && !p1 && !p2) return null;

  return (
    <section className="extras-panels" aria-label="Racial and profession bonuses">
      {race ? <RaceAbilityPanel race={race} /> : null}
      {p1 ? (
        <ProfessionAbilityPanel profession={p1} slotLabel="Profession 1" />
      ) : null}
      {p2 ? (
        <ProfessionAbilityPanel profession={p2} slotLabel="Profession 2" />
      ) : null}
    </section>
  );
}
