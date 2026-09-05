import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

let dataSource: DataSource | null = null;

const USERS_TABLE = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  roles TEXT[] NOT NULL DEFAULT '{}',
  voice_rate TEXT NOT NULL DEFAULT 'very-slow',
  xp INTEGER NOT NULL DEFAULT 0,
  scores JSONB NOT NULL DEFAULT '{}',
  last_unit TEXT,
  last_mode TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)
`;

export async function getDataSource() {
  if (dataSource?.isInitialized) return dataSource;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não está definida.");
  const local = /localhost|127\.0\.0\.1/.test(url);
  if (process.env.VERCEL && local) {
    throw new Error("DATABASE_URL na Vercel aponta para localhost. Use a URL do Postgres da nuvem.");
  }

  const next = new DataSource({
    type: "postgres",
    url,
    entities: [User],
    synchronize: false,
    logging: false,
    ssl: local ? false : { rejectUnauthorized: false },
  });

  try {
    await next.initialize();
    await next.query(USERS_TABLE);
    dataSource = next;
    return dataSource;
  } catch (error) {
    if (next.isInitialized) await next.destroy().catch(() => undefined);
    dataSource = null;
    throw error;
  }
}
