import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1757042400000 implements MigrationInterface {
  name = "CreateUsers1757042400000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable("users")) return;
    await queryRunner.query(`
      CREATE TABLE users (
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
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
