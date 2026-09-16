import { units as rawFundamentals } from "./fundamentals";
import { extraDailyUnits } from "./daily-journey";
import { applySprintMeta, project1ExtraUnits } from "./project-1/units";
import { clampDays, clampSprints } from "./projects";
import { ALL_ROLES, type RoleId } from "./roles";
import { workUnits, type Unit } from "./work-units";

export type { Unit } from "./work-units";
export type { SprintPhase } from "./work-units";

export function todayStamp(now = new Date()) {
  return now.toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
}

let cachedWork: Unit[] | null = null;

function allWork(): Unit[] {
  if (!cachedWork) {
    cachedWork = [...workUnits, ...extraDailyUnits, ...project1ExtraUnits()].map(applySprintMeta);
  }
  return cachedWork;
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

export function unitsForRoles(roles: RoleId[] = []) {
  const list = allUnits();
  const selected = roles || [];
  const work = list.filter((unit) => unit.track === "work" && unit.roles.some((role) => selected.includes(role)));
  const fundamentals = list.filter((unit) => unit.track === "fundamentals");
  return { work, fundamentals };
}

export function unitById(id: string) {
  return allUnits().find((unit) => unit.id === id);
}

export function unitIdsForProject(project: number) {
  return allUnits().filter((unit) => unit.project === project).map((unit) => unit.id);
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

export function modeProgress(unit: Unit, mode: "speak" | "write", scores: Record<string, number>) {
  const list = mode === "speak" ? unit.speak : unit.write;
  let done = 0;
  for (let i = 0; i < list.length; i += 1) {
    if (itemDone(unit.id, mode, i, scores)) done += 1;
  }
  return { done, total: list.length, complete: list.length > 0 && done >= list.length };
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

export type SprintContext = {
  roles: RoleId[];
  scores: Record<string, number>;
  completedAt: Record<string, string>;
  sprintCount: number;
  sprintDays: number;
  currentProject: number;
};

export function sprintContextFrom(input: {
  roles?: string[] | null;
  scores?: Record<string, number> | null;
  completedAt?: Record<string, string> | null;
  sprintCount?: number | null;
  sprintDays?: number | null;
  currentProject?: number | null;
}): SprintContext {
  return {
    roles: (input.roles || []) as RoleId[],
    scores: input.scores || {},
    completedAt: input.completedAt || {},
    sprintCount: clampSprints(input.sprintCount ?? 1),
    sprintDays: clampDays(input.sprintDays ?? 5),
    currentProject: input.currentProject ?? 1,
  };
}

function roleWork(roles: RoleId[]) {
  return allWork().filter((unit) => unit.roles.some((role) => roles.includes(role)));
}

function joinTrack(roles: RoleId[]) {
  return roles.some((role) => role === "developer" || role === "product-owner" || role === "manager");
}

function leadTrack(roles: RoleId[]) {
  return roles.some((role) => role === "tech-lead" || role === "scrum-master");
}

function ceremonyFor(ctx: SprintContext, sprint: number, phase: "planning" | "review" | "retro") {
  return roleWork(ctx.roles).find(
    (unit) => unit.project === ctx.currentProject && unit.sprint === sprint && unit.phase === phase
  );
}

function dailiesFor(ctx: SprintContext, sprint: number) {
  const pool = roleWork(ctx.roles).filter(
    (unit) =>
      unit.project === ctx.currentProject &&
      unit.sprint === sprint &&
      unit.phase === "daily" &&
      (unit.day || 0) <= ctx.sprintDays
  );
  const track = joinTrack(ctx.roles)
    ? pool.filter((unit) => unit.roles.includes("developer"))
    : leadTrack(ctx.roles)
      ? pool.filter((unit) => unit.roles.includes("scrum-master"))
      : [];
  return [...track].sort((a, b) => (a.day || 0) - (b.day || 0));
}

function midFor(ctx: SprintContext, sprint: number) {
  return roleWork(ctx.roles).filter(
    (unit) => unit.project === ctx.currentProject && unit.sprint === sprint && unit.phase === "mid"
  );
}

function sprintUnits(ctx: SprintContext, sprint: number) {
  const planning = ceremonyFor(ctx, sprint, "planning");
  const dailies = dailiesFor(ctx, sprint);
  const review = ceremonyFor(ctx, sprint, "review");
  const retro = ceremonyFor(ctx, sprint, "retro");
  const mid = midFor(ctx, sprint);
  return { planning, dailies, review, retro, mid };
}

function isSprintComplete(ctx: SprintContext, sprint: number) {
  const { planning, dailies, review, retro } = sprintUnits(ctx, sprint);
  if (planning && !isUnitComplete(planning, ctx.scores)) return false;
  if (dailies.some((unit) => !isUnitComplete(unit, ctx.scores))) return false;
  if (review && !isUnitComplete(review, ctx.scores)) return false;
  if (retro && !isUnitComplete(retro, ctx.scores)) return false;
  return Boolean(planning || dailies.length || review || retro);
}

export type SprintHome =
  | { status: "planning"; unit: Unit; sprint: number; sprintCount: number; sprintDays: number }
  | { status: "daily"; unit: Unit; day: number; sprint: number; sprintCount: number; sprintDays: number }
  | { status: "waiting-daily"; next: Unit; day: number; sprint: number; sprintCount: number; sprintDays: number }
  | { status: "review"; unit: Unit; sprint: number; sprintCount: number; sprintDays: number }
  | { status: "retro"; unit: Unit; sprint: number; sprintCount: number; sprintDays: number }
  | { status: "waiting-sprint"; nextSprint: number; sprint: number; sprintCount: number; sprintDays: number }
  | { status: "project-done"; sprint: number; sprintCount: number; sprintDays: number }
  | { status: "none"; sprint: number; sprintCount: number; sprintDays: number };

function currentSprintState(ctx: SprintContext, today = todayStamp()) {
  for (let sprint = 1; sprint <= ctx.sprintCount; sprint += 1) {
    if (!isSprintComplete(ctx, sprint)) return { sprint, waiting: false as const };
    if (sprint === ctx.sprintCount) return { sprint, waiting: false as const, done: true as const };
    const { retro, review, dailies, planning } = sprintUnits(ctx, sprint);
    const closer = retro || review || dailies[dailies.length - 1] || planning;
    const doneOn = closer ? ctx.completedAt[closer.id] || today : today;
    if (doneOn >= today) return { sprint: sprint + 1, waiting: true as const };
  }
  return { sprint: ctx.sprintCount, waiting: false as const, done: true as const };
}

export function sprintPhase(ctx: SprintContext, today = todayStamp()): SprintHome {
  const base = { sprintCount: ctx.sprintCount, sprintDays: ctx.sprintDays };
  if (!ctx.roles.length) return { status: "none", sprint: 1, ...base };

  const state = currentSprintState(ctx, today);
  if ("done" in state && state.done) {
    return { status: "project-done", sprint: ctx.sprintCount, ...base };
  }
  if (state.waiting) {
    return { status: "waiting-sprint", nextSprint: state.sprint, sprint: state.sprint - 1, ...base };
  }

  const sprint = state.sprint;
  const { planning, dailies, review, retro } = sprintUnits(ctx, sprint);

  if (planning && !isUnitComplete(planning, ctx.scores)) {
    return { status: "planning", unit: planning, sprint, ...base };
  }

  for (let i = 0; i < dailies.length; i += 1) {
    const unit = dailies[i];
    const day = unit.day || i + 1;
    if (isUnitComplete(unit, ctx.scores)) continue;
    if (i === 0) return { status: "daily", unit, day, sprint, ...base };
    const prev = dailies[i - 1];
    const doneOn = ctx.completedAt[prev.id] || today;
    if (doneOn < today) return { status: "daily", unit, day, sprint, ...base };
    return { status: "waiting-daily", next: unit, day, sprint, ...base };
  }

  if (review && !isUnitComplete(review, ctx.scores)) {
    return { status: "review", unit: review, sprint, ...base };
  }
  if (retro && !isUnitComplete(retro, ctx.scores)) {
    return { status: "retro", unit: retro, sprint, ...base };
  }

  if (sprint < ctx.sprintCount) {
    return { status: "waiting-sprint", nextSprint: sprint + 1, sprint, ...base };
  }
  return { status: "project-done", sprint, ...base };
}

export function projectStarted(ctx: SprintContext) {
  return roleWork(ctx.roles).some(
    (unit) =>
      unit.project === ctx.currentProject &&
      unit.phase &&
      unit.phase !== "mid" &&
      isUnitComplete(unit, ctx.scores)
  );
}

export function isUnitLocked(unit: Unit, ctx: SprintContext) {
  if (unit.track === "fundamentals") return false;
  if (!unit.phase) return false;
  if (isUnitComplete(unit, ctx.scores)) return false;

  const home = sprintPhase(ctx);
  if ("unit" in home && home.unit.id === unit.id) return false;
  if (
    unit.phase === "mid" &&
    (home.status === "daily" || home.status === "waiting-daily") &&
    unit.sprint === home.sprint &&
    unit.project === ctx.currentProject
  ) {
    return false;
  }
  return true;
}

export function celebrateCopy(unit: Unit, home: SprintHome) {
  if (unit.phase === "planning") {
    return "Planning ok. A Daily 1 já está no Meu dia.";
  }
  if (unit.phase === "daily" && home.status === "waiting-daily") {
    return `A ${home.next.title} será liberada amanhã no Meu dia.`;
  }
  if (unit.phase === "daily" && home.status === "review") {
    return "A última daily da sprint está feita. O Review já está no Meu dia.";
  }
  if (unit.phase === "daily" && home.status === "retro") {
    return "A última daily da sprint está feita. A Retro já está no Meu dia.";
  }
  if (unit.phase === "review") {
    return "Review ok. A Retro já está no Meu dia.";
  }
  if (unit.phase === "retro" && home.status === "waiting-sprint") {
    return `Sprint ${home.sprint} fechada. A Sprint ${home.nextSprint} começa amanhã.`;
  }
  if (unit.phase === "retro" && home.status === "project-done") {
    return "Projeto concluído. O próximo nível chega em breve.";
  }
  return `Você completou as atividades de ${unit.title}. Ela foi para Revisar.`;
}

export function phaseLabel(home: SprintHome) {
  if (home.status === "planning") return "Planning";
  if (home.status === "daily") return `Dia ${home.day} de ${home.sprintDays}`;
  if (home.status === "waiting-daily") return `Dia ${home.day - 1} de ${home.sprintDays}`;
  if (home.status === "review") return "Review";
  if (home.status === "retro") return "Retro";
  if (home.status === "waiting-sprint") return "Sprint fechada";
  if (home.status === "project-done") return "Projeto concluído";
  return "";
}

export function dailySequence(roles: RoleId[]): Unit[] {
  const ctx = sprintContextFrom({ roles, sprintCount: 10, sprintDays: 10, currentProject: 1 });
  const days: Unit[] = [];
  for (let sprint = 1; sprint <= 10; sprint += 1) {
    days.push(...dailiesFor({ ...ctx, sprintDays: 10 }, sprint));
  }
  return days;
}

export type DailyHome =
  | { status: "active"; unit: Unit; step: number; total: number }
  | { status: "waiting"; next: Unit; step: number; total: number }
  | { status: "finished"; total: number }
  | { status: "none" };

export function dailyHome(ctx: SprintContext, today = todayStamp()): DailyHome {
  const home = sprintPhase(ctx, today);
  if (home.status === "daily") {
    return { status: "active", unit: home.unit, step: home.day, total: home.sprintDays };
  }
  if (home.status === "waiting-daily") {
    return { status: "waiting", next: home.next, step: home.day, total: home.sprintDays };
  }
  if (home.status === "review" || home.status === "retro" || home.status === "project-done" || home.status === "waiting-sprint") {
    return { status: "finished", total: home.sprintDays };
  }
  return { status: "none" };
}

export function homeContent(ctx: SprintContext) {
  const { work, fundamentals } = unitsForRoles(ctx.roles);
  const fundSplit = splitUnits(fundamentals, ctx.scores);
  const home = sprintPhase(ctx);
  const sprint = "sprint" in home ? home.sprint : 1;
  const { mid, planning, dailies, review, retro } = sprintUnits(ctx, sprint);
  const showMid = home.status === "daily" || home.status === "waiting-daily";
  const workActive = showMid ? mid.filter((unit) => !isUnitComplete(unit, ctx.scores)) : [];
  const completedWork = work.filter(
    (unit) => unit.project === ctx.currentProject && isUnitComplete(unit, ctx.scores)
  );
  const sprintTrack = [planning, ...dailies, review, retro, ...mid].filter((unit): unit is Unit => Boolean(unit));
  return {
    sprintHome: home,
    workActive,
    fundamentalsActive: fundSplit.active,
    review: [...completedWork, ...fundSplit.completed],
    sprintTrack,
  };
}
