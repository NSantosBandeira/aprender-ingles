import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordHash1757300000000 implements MigrationInterface {
  name = "AddPasswordHash1757300000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS password_hash TEXT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS password_hash`);
  }
}
