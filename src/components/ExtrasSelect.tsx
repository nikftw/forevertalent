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

type ExtrasSelectProps = {
  classSlug: string;
  selection: ExtrasSelection;
  onChange: (next: ExtrasSelection) => void;
};

type ProfessionSlot = "p1" | "p2";

export function ExtrasSelect({
  classSlug,
  selection,
  onChange,
}: ExtrasSelectProps) {
  const race = getRace(selection.race);
  const p1 = getProfession(selection.p1);
  const p2 = getProfession(selection.p2);
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

  const hasPanels = Boolean(race || p1 || p2);

  return (
    <section className="extras" aria-label="Race and professions">
      <div className="extras-controls">
        <div className="extras-group">
          <span className="extras-label">Race</span>
          <div className="extras-icons" role="listbox" aria-label="Race">
            {availableRaces.map((entry) => {
              const active = selection.race === entry.slug;
              const label =
                entry.slug.startsWith("skyborne-")
                  ? `${entry.name} (${entry.faction === "alliance" ? "Alliance" : "Horde"})`
                  : entry.name;
              return (
                <button
                  key={entry.slug}
                  type="button"
                  role="option"
                  aria-selected={active}
                  title={label}
                  className={
                    active ? "extra-icon is-active" : "extra-icon"
                  }
                  data-faction={entry.faction}
                  onClick={() => setRace(active ? null : entry.slug)}
                >
                  <img
                    src={iconUrl(entry.icon, "medium")}
                    alt={label}
                    width={32}
                    height={32}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="extras-group extras-group-professions">
          <span className="extras-label">Professions</span>
          <div
            className="extras-icons"
            role="listbox"
            aria-label="Professions"
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
                    width={32}
                    height={32}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {hasPanels ? (
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
