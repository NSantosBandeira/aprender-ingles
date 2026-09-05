import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

let dataSource: DataSource | null = null;

export async function getDataSource() {
  if (dataSource?.isInitialized) return dataSource;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não está definida.");

  dataSource = new DataSource({
    type: "postgres",
    url,
    entities: [User],
    synchronize: false,
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}
