import "reflect-metadata";
import { User, type UserRow } from "./entities/User";
import { getDataSource } from "./data-source";
import { isUnitComplete, todayStamp, unitById, unitIdsForProject } from "./content";
import {
  DEFAULT_DAYS,
  DEFAULT_SPRINTS,
  normalizeProjectSetups,
  removeProjectSetup,
  setupForProject,
  upsertProjectSetup,
  type ProjectSetup,
} from "./projects";

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  roles: string[];
  voiceRate: string;
  xp: number;
  scores: Record<string, number>;
  lastUnit: string | null;
  lastMode: string | null;
  completedAt: Record<string, string>;
  currentProject: number;
  projectSetups: ProjectSetup[];
  sprintCount: number;
  sprintDays: number;
  projectConfigured: boolean;
};

function toProfile(user: UserRow): Profile {
  const currentProject = user.currentProject ?? 1;
  const setups = normalizeProjectSetups(user.projectSetups);
  const current = setupForProject(setups, currentProject);
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    roles: user.roles || [],
    voiceRate: user.voiceRate,
    xp: user.xp,
    scores: user.scores || {},
    lastUnit: user.lastUnit,
    lastMode: user.lastMode,
    completedAt: user.completedAt || {},
    currentProject,
    projectSetups: setups,
    sprintCount: current?.sprintCount ?? DEFAULT_SPRINTS,
    sprintDays: current?.sprintDays ?? DEFAULT_DAYS,
    projectConfigured: Boolean(current),
  };
}

async function users() {
  const ds = await getDataSource();
  return ds.getRepository(User);
}

export async function upsertUser(input: { id: string; email: string; name?: string | null; image?: string | null }) {
  const repo = await users();
  let user = await repo.findOne({ where: { email: input.email } });
  if (!user) {
    user = repo.create({
      id: input.id,
      email: input.email,
      name: input.name || null,
      image: input.image || null,
      passwordHash: null,
      roles: [],
      voiceRate: "very-slow",
      xp: 0,
      scores: {},
      completedAt: {},
      currentProject: 1,
      projectSetups: [],
    });
  } else {
    user.name = input.name || user.name;
    user.image = input.image || user.image;
  }
  return toProfile(await repo.save(user));
}

export async function getUserByEmail(email: string) {
  const repo = await users();
  const user = await repo.findOne({ where: { email } });
  return user ? toProfile(user) : null;
}

export async function getUserAuthByEmail(email: string) {
  const repo = await users();
  return repo.findOne({ where: { email } });
}

export async function createUserWithPassword(input: { name: string; email: string; passwordHash: string }) {
  const repo = await users();
  const user = repo.create({
    id: crypto.randomUUID(),
    email: input.email,
    name: input.name,
    image: null,
    passwordHash: input.passwordHash,
    roles: [],
    voiceRate: "very-slow",
    xp: 0,
    scores: {},
    completedAt: {},
    currentProject: 1,
    projectSetups: [],
  });
  return toProfile(await repo.save(user));
}

export async function updateRoles(email: string, roles: string[]) {
  const repo = await users();
  const user = await repo.findOne({ where: { email } });
  if (!user) return null;
  user.roles = roles;
  return toProfile(await repo.save(user));
}

export async function updateVoiceRate(email: string, voiceRate: string) {
  const repo = await users();
  const user = await repo.findOne({ where: { email } });
  if (!user) return null;
  user.voiceRate = voiceRate;
  return toProfile(await repo.save(user));
}

export async function updateProjectSetup(email: string, sprintCount: number, sprintDays: number, project?: number) {
  const repo = await users();
  const user = await repo.findOne({ where: { email } });
  if (!user) return null;
  const currentProject = project || user.currentProject || 1;
  user.currentProject = currentProject;
  user.projectSetups = upsertProjectSetup(user.projectSetups, {
    project: currentProject,
    sprintCount,
    sprintDays,
  });
  return toProfile(await repo.save(user));
}

export async function resetCurrentProject(email: string) {
  const repo = await users();
  const user = await repo.findOne({ where: { email } });
  if (!user) return null;
  const project = user.currentProject || 1;
  const ids = new Set(unitIdsForProject(project));
  const scores = { ...(user.scores || {}) };
  for (const key of Object.keys(scores)) {
    const unitId = key.replace(/:(speak|write):\d+$/, "");
    if (ids.has(unitId)) delete scores[key];
  }
  const completedAt = { ...(user.completedAt || {}) };
  for (const unitId of Object.keys(completedAt)) {
    if (ids.has(unitId)) delete completedAt[unitId];
  }
  user.scores = scores;
  user.completedAt = completedAt;
  user.xp = Object.values(scores).reduce((sum, stars) => sum + (Number(stars) || 0) * 10, 0);
  if (user.lastUnit && ids.has(user.lastUnit)) {
    user.lastUnit = null;
    user.lastMode = null;
  }
  user.projectSetups = removeProjectSetup(user.projectSetups, project);
  return toProfile(await repo.save(user));
}

export async function saveScore(email: string, key: string, stars: number, lastUnit: string, lastMode: string) {
  const repo = await users();
  const user = await repo.findOne({ where: { email } });
  if (!user) return null;
  const scores = { ...(user.scores || {}) };
  const prev = scores[key] || 0;
  if (stars > prev) {
    user.xp += (stars - prev) * 10;
    scores[key] = stars;
    user.scores = scores;
  }
  user.lastUnit = lastUnit;
  user.lastMode = lastMode;
  const unit = unitById(lastUnit);
  if (unit && isUnitComplete(unit, user.scores || scores)) {
    const completedAt = { ...(user.completedAt || {}) };
    if (!completedAt[unit.id]) {
      completedAt[unit.id] = todayStamp();
      user.completedAt = completedAt;
    }
  }
  return toProfile(await repo.save(user));
}
