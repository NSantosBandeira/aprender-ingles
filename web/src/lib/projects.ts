export const MIN_SPRINTS = 1;
export const MAX_SPRINTS = 10;
export const MIN_DAYS = 3;
export const MAX_DAYS = 10;
export const DEFAULT_SPRINTS = 1;
export const DEFAULT_DAYS = 5;
export const CONTENT_PROJECTS = 1;

export type ProjectSetup = {
  project: number;
  sprintCount: number;
  sprintDays: number;
};

export function clampSprints(value: number) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return DEFAULT_SPRINTS;
  return Math.min(MAX_SPRINTS, Math.max(MIN_SPRINTS, n));
}

export function clampDays(value: number) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return DEFAULT_DAYS;
  return Math.min(MAX_DAYS, Math.max(MIN_DAYS, n));
}

export function sprintRange() {
  return Array.from({ length: MAX_SPRINTS }, (_, i) => i + 1);
}

export function dayRange() {
  return Array.from({ length: MAX_DAYS - MIN_DAYS + 1 }, (_, i) => i + MIN_DAYS);
}

export function normalizeProjectSetups(raw: unknown): ProjectSetup[] {
  if (!Array.isArray(raw)) return [];
  const byProject = new Map<number, ProjectSetup>();
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const project = Math.round(Number(row.project));
    if (!Number.isFinite(project) || project < 1) continue;
    byProject.set(project, {
      project,
      sprintCount: clampSprints(Number(row.sprintCount)),
      sprintDays: clampDays(Number(row.sprintDays)),
    });
  }
  return [...byProject.values()].sort((a, b) => a.project - b.project);
}

export function setupForProject(setups: ProjectSetup[], project: number) {
  return setups.find((item) => item.project === project);
}

export function upsertProjectSetup(setups: ProjectSetup[], next: ProjectSetup): ProjectSetup[] {
  const cleaned = normalizeProjectSetups(setups);
  const entry: ProjectSetup = {
    project: next.project,
    sprintCount: clampSprints(next.sprintCount),
    sprintDays: clampDays(next.sprintDays),
  };
  const without = cleaned.filter((item) => item.project !== entry.project);
  return [...without, entry].sort((a, b) => a.project - b.project);
}
