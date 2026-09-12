"use client";

import { iconUrl } from "@/lib/assets";
import { HoverTooltip } from "@/components/HoverTooltip";
import type { ExtraAbility, ProfessionInfo, RaceInfo } from "@/data/types";

type AbilityIconProps = {
  ability: ExtraAbility;
};

function AbilityIcon({ ability }: AbilityIconProps) {
  return (
    <HoverTooltip
      className="extra-ability"
      label={ability.name}
      content={
        <>
          <div className="tooltip-head">
            <strong>{ability.name}</strong>
            {ability.passive ? <span>Passive</span> : null}
          </div>
          <p>{ability.description}</p>
        </>
      }
    >
      <img
        src={iconUrl(ability.icon)}
        alt=""
        width={36}
        height={36}
        draggable={false}
      />
    </HoverTooltip>
  );
}

type RaceAbilityPanelProps = {
  race: RaceInfo;
};

export function RaceAbilityPanel({ race }: RaceAbilityPanelProps) {
  return (
    <div className="extra-panel">
      <p className="extra-panel-title">
        <img src={iconUrl(race.icon, "medium")} alt="" width={20} height={20} />
        {race.name} Racials
      </p>
      <div className="extra-ability-row">
        {race.abilities.map((ability) => (
          <AbilityIcon key={ability.name} ability={ability} />
        ))}
      </div>
    </div>
  );
}

type ProfessionAbilityPanelProps = {
  profession: ProfessionInfo;
  /** Shown as "Profession 1: Alchemy". */
  slotLabel: string;
};

export function ProfessionAbilityPanel({
  profession,
  slotLabel,
}: ProfessionAbilityPanelProps) {
  return (
    <div className="extra-panel">
      <p className="extra-panel-title">
        <img
          src={iconUrl(profession.icon, "medium")}
          alt=""
          width={20}
          height={20}
        />
        {`${slotLabel}: ${profession.name}`}
      </p>
      <div className="extra-ability-row">
        {profession.bonuses.map((bonus) => (
          <AbilityIcon key={bonus.name} ability={bonus} />
        ))}
      </div>
    </div>
  );
}
