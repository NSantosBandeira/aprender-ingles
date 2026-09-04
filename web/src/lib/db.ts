import postgres from "postgres";

const url = process.env.DATABASE_URL;

export const sql = url
  ? postgres(url, { max: 5 })
  : (null as unknown as ReturnType<typeof postgres>);

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

function mapUser(row: Record<string, unknown>): Profile {
  const scoresRaw = row.scores;
  const scores =
    typeof scoresRaw === "string" ? JSON.parse(scoresRaw) : (scoresRaw as Record<string, number>) || {};
  return {
    id: String(row.id),
    email: String(row.email),
    name: (row.name as string | null) || null,
    image: (row.image as string | null) || null,
    roles: (row.roles as string[]) || [],
    voiceRate: String(row.voice_rate || "very-slow"),
    xp: Number(row.xp || 0),
    scores,
    lastUnit: (row.last_unit as string | null) || null,
    lastMode: (row.last_mode as string | null) || null,
  };
}

export async function upsertUser(input: { id: string; email: string; name?: string | null; image?: string | null }) {
  const rows = await sql`
    INSERT INTO users (id, email, name, image)
    VALUES (${input.id}, ${input.email}, ${input.name || null}, ${input.image || null})
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      image = EXCLUDED.image,
      updated_at = NOW()
    RETURNING *
  `;
  return mapUser(rows[0] as Record<string, unknown>);
}

export async function getUserByEmail(email: string) {
  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  return rows[0] ? mapUser(rows[0] as Record<string, unknown>) : null;
}

export async function updateRoles(email: string, roles: string[]) {
  const rows = await sql`
    UPDATE users SET roles = ${roles}, updated_at = NOW()
    WHERE email = ${email}
    RETURNING *
  `;
  return rows[0] ? mapUser(rows[0] as Record<string, unknown>) : null;
}

export async function updateVoiceRate(email: string, voiceRate: string) {
  const rows = await sql`
    UPDATE users SET voice_rate = ${voiceRate}, updated_at = NOW()
    WHERE email = ${email}
    RETURNING *
  `;
  return rows[0] ? mapUser(rows[0] as Record<string, unknown>) : null;
}

export async function saveScore(email: string, key: string, stars: number, lastUnit: string, lastMode: string) {
  const current = await getUserByEmail(email);
  if (!current) return null;
  const prev = current.scores[key] || 0;
  const scores = { ...current.scores };
  let xp = current.xp;
  if (stars > prev) {
    xp += (stars - prev) * 10;
    scores[key] = stars;
  }
  const rows = await sql`
    UPDATE users SET
      scores = ${sql.json(scores as Record<string, number>)},
      xp = ${xp},
      last_unit = ${lastUnit},
      last_mode = ${lastMode},
      updated_at = NOW()
    WHERE email = ${email}
    RETURNING *
  `;
  return rows[0] ? mapUser(rows[0] as Record<string, unknown>) : current;
}
