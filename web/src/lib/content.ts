import { units as rawFundamentals } from "./fundamentals";
import { ALL_ROLES, type RoleId } from "./roles";
import { workUnits, type Unit } from "./work-units";

export type { Unit } from "./work-units";

export function allUnits(): Unit[] {
  const fundamentals = rawFundamentals.map((unit) => ({
    ...unit,
    track: "fundamentals" as const,
    scene: unit.id,
    roles: ALL_ROLES,
  }));
  return [...workUnits, ...fundamentals];
}

export function unitsForRoles(roles: RoleId[]) {
  const list = allUnits();
  const work = list.filter((unit) => unit.track === "work" && unit.roles.some((role) => roles.includes(role)));
  const fundamentals = list.filter((unit) => unit.track === "fundamentals");
  return { work, fundamentals };
}

export function unitById(id: string) {
  return allUnits().find((unit) => unit.id === id);
}

export function itemKey(unitId: string, mode: string, index: number) {
  return `${unitId}:${mode}:${index}`;
}

export function unitProgress(unit: Unit, scores: Record<string, number>) {
  const total = unit.speak.length + unit.write.length;
  let done = 0;
  let stars = 0;
  for (let i = 0; i < unit.speak.length; i += 1) {
    const value = scores[itemKey(unit.id, "speak", i)] || 0;
    stars += value;
    if (value) done += 1;
  }
  for (let i = 0; i < unit.write.length; i += 1) {
    const value = scores[itemKey(unit.id, "write", i)] || 0;
    stars += value;
    if (value) done += 1;
  }
  return { done, total, stars };
}
