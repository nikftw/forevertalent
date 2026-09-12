import professionsData from "@/data/professions.json";
import racialsData from "@/data/racials.json";
import type {
  ExtrasSelection,
  ProfessionInfo,
  RaceInfo,
} from "@/data/types";

export const RACES: RaceInfo[] = racialsData.races as RaceInfo[];
export const PROFESSIONS: ProfessionInfo[] = professionsData.professions as ProfessionInfo[];

export function getRace(slug: string | null | undefined): RaceInfo | undefined {
  if (!slug) return undefined;
  return RACES.find((race) => race.slug === slug);
}

export function getProfession(
  slug: string | null | undefined,
): ProfessionInfo | undefined {
  if (!slug) return undefined;
  return PROFESSIONS.find((profession) => profession.slug === slug);
}

export function isRaceSlug(slug: string): boolean {
  return RACES.some((race) => race.slug === slug);
}

export function isProfessionSlug(slug: string): boolean {
  return PROFESSIONS.some((profession) => profession.slug === slug);
}

export function parseExtras(search: string): ExtrasSelection {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const raceRaw = params.get("race");
  const p1Raw = params.get("p1");
  const p2Raw = params.get("p2");
  const race = raceRaw && isRaceSlug(raceRaw) ? raceRaw : null;
  let p1 = p1Raw && isProfessionSlug(p1Raw) ? p1Raw : null;
  let p2 = p2Raw && isProfessionSlug(p2Raw) ? p2Raw : null;
  if (p1 && p2 && p1 === p2) p2 = null;
  return { race, p1, p2 };
}

export function serializeExtras(selection: ExtrasSelection): string {
  const params = new URLSearchParams();
  if (selection.race && isRaceSlug(selection.race)) {
    params.set("race", selection.race);
  }
  if (selection.p1 && isProfessionSlug(selection.p1)) {
    params.set("p1", selection.p1);
  }
  if (
    selection.p2 &&
    isProfessionSlug(selection.p2) &&
    selection.p2 !== selection.p1
  ) {
    params.set("p2", selection.p2);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function extrasEqual(a: ExtrasSelection, b: ExtrasSelection): boolean {
  return a.race === b.race && a.p1 === b.p1 && a.p2 === b.p2;
}
