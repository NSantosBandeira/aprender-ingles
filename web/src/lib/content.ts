import { units as rawFundamentals } from "./fundamentals";
import { extraDailyUnits } from "./daily-journey";
import { ALL_ROLES, type RoleId } from "./roles";
import { workUnits, type Unit } from "./work-units";

export type { Unit } from "./work-units";

export function todayStamp(now = new Date()) {
  return now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

function allWork(): Unit[] {
  return [...workUnits, ...extraDailyUnits];
}

export function allUnits(): Unit[] {
  const fundamentals = rawFundamentals.map((unit) => ({
    ...unit,
    track: "fundamentals" as const,
    scene: unit.id,
    roles: ALL_ROLES,
  }));
  return [...allWork(), ...fundamentals];
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

export function itemDone(unitId: string, mode: string, index: number, scores: Record<string, number>) {
  return (scores[itemKey(unitId, mode, index)] || 0) > 0;
}

export function firstIncompleteIndex(unit: Unit, mode: "speak" | "write", scores: Record<string, number>) {
  const list = mode === "speak" ? unit.speak : unit.write;
  for (let i = 0; i < list.length; i += 1) {
    if (!itemDone(unit.id, mode, i, scores)) return i;
  }
  return -1;
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

export function isUnitComplete(unit: Unit, scores: Record<string, number>) {
  const { done, total } = unitProgress(unit, scores);
  return total > 0 && done >= total;
}

export function splitUnits(units: Unit[], scores: Record<string, number>) {
  const active: Unit[] = [];
  const completed: Unit[] = [];
  for (const unit of units) {
    (isUnitComplete(unit, scores) ? completed : active).push(unit);
  }
  return { active, completed };
}

export function dailySequence(roles: RoleId[]): Unit[] {
  const join = roles.some((role) => role === "developer" || role === "product-owner" || role === "manager");
  const lead = roles.some((role) => role === "tech-lead" || role === "scrum-master");
  const pool = allWork().filter((unit) => unit.scene === "daily");
  const track = join
    ? pool.filter((unit) => unit.roles.includes("developer"))
    : lead
      ? pool.filter((unit) => unit.roles.includes("scrum-master"))
      : [];
  return [...track].sort((a, b) => (a.journey || 0) - (b.journey || 0));
}

export type DailyHome =
  | { status: "active"; unit: Unit; step: number; total: number }
  | { status: "waiting"; next: Unit; step: number; total: number }
  | { status: "finished"; total: number }
  | { status: "none" };

export function dailyHome(
  roles: RoleId[],
  scores: Record<string, number>,
  completedAt: Record<string, string>,
  today = todayStamp()
): DailyHome {
  const sequence = dailySequence(roles);
  if (!sequence.length) return { status: "none" };
  const total = sequence.length;

  for (let i = 0; i < sequence.length; i += 1) {
    const unit = sequence[i];
    const step = unit.journey || i + 1;
    if (isUnitComplete(unit, scores)) continue;
    if (i === 0) return { status: "active", unit, step, total };
    const prev = sequence[i - 1];
    const doneOn = completedAt[prev.id] || today;
    if (doneOn < today) return { status: "active", unit, step, total };
    return { status: "waiting", next: unit, step, total };
  }

  return { status: "finished", total };
}

export function homeContent(
  roles: RoleId[],
  scores: Record<string, number>,
  completedAt: Record<string, string>
) {
  const { work, fundamentals } = unitsForRoles(roles);
  const otherWork = work.filter((unit) => unit.scene !== "daily");
  const workSplit = splitUnits(otherWork, scores);
  const fundSplit = splitUnits(fundamentals, scores);
  const dailyUnits = dailySequence(roles);
  const review = [
    ...dailyUnits.filter((unit) => isUnitComplete(unit, scores)),
    ...workSplit.completed,
    ...fundSplit.completed,
  ];
  return {
    daily: dailyHome(roles, scores, completedAt),
    workActive: workSplit.active,
    fundamentalsActive: fundSplit.active,
    review,
  };
}
