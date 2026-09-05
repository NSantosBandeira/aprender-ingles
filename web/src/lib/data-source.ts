import "reflect-metadata";
import pg from "pg";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { migrations } from "./migrations";

let dataSource: DataSource | null = null;

function postgresUrl(raw: string) {
  const parsed = new URL(raw);
  parsed.searchParams.delete("channel_binding");
  return parsed.toString();
}

export async function getDataSource() {
  if (dataSource?.isInitialized) return dataSource;

  const url =
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL não está definida.");
  const local = /localhost|127\.0\.0\.1/.test(url);
  if (process.env.VERCEL && local) {
    throw new Error("DATABASE_URL na Vercel aponta para localhost. Use a URL do Postgres da nuvem.");
  }

  const next = new DataSource({
    type: "postgres",
    driver: pg,
    url: postgresUrl(url),
    entities: [User],
    migrations,
    migrationsRun: true,
    migrationsTableName: "typeorm_migrations",
    synchronize: false,
    logging: false,
    ssl: local ? false : { rejectUnauthorized: false },
    extra: {
      max: process.env.VERCEL ? 1 : 5,
    },
  });

  try {
    await next.initialize();
    dataSource = next;
    return dataSource;
  } catch (error) {
    if (next.isInitialized) await next.destroy().catch(() => undefined);
    dataSource = null;
    throw error;
  }
}
