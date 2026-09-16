import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddSprintSetup1757400000000 implements MigrationInterface {
  name = "AddSprintSetup1757400000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS sprint_count INTEGER NOT NULL DEFAULT 1`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS sprint_days INTEGER NOT NULL DEFAULT 5`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS current_project INTEGER NOT NULL DEFAULT 1`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS project_configured BOOLEAN NOT NULL DEFAULT true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS sprint_count`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS sprint_days`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS current_project`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS project_configured`);
  }
}
