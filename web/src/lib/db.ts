import "reflect-metadata";
import { User, type UserRow } from "./entities/User";
import { getDataSource } from "./data-source";

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
};

function toProfile(user: UserRow): Profile {
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
      roles: [],
      voiceRate: "very-slow",
      xp: 0,
      scores: {},
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
  return toProfile(await repo.save(user));
}
