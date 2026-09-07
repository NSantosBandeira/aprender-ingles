import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddCompletedAt1757200000000 implements MigrationInterface {
  name = "AddCompletedAt1757200000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS completed_at JSONB NOT NULL DEFAULT '{}'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS completed_at`);
  }
}
