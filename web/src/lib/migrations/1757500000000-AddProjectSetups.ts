import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectSetups1757500000000 implements MigrationInterface {
  name = "AddProjectSetups1757500000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS project_setups JSONB NOT NULL DEFAULT '[]'`);
    await queryRunner.query(`
      UPDATE users
      SET project_setups = jsonb_build_array(
        jsonb_build_object(
          'project', COALESCE(current_project, 1),
          'sprintCount', COALESCE(sprint_count, 1),
          'sprintDays', COALESCE(sprint_days, 5)
        )
      )
      WHERE COALESCE(project_configured, false) = true
        AND (project_setups = '[]'::jsonb OR project_setups IS NULL)
    `);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS sprint_count`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS sprint_days`);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS project_configured`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS sprint_count INTEGER NOT NULL DEFAULT 1`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS sprint_days INTEGER NOT NULL DEFAULT 5`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS project_configured BOOLEAN NOT NULL DEFAULT false`);
    await queryRunner.query(`
      UPDATE users
      SET
        sprint_count = COALESCE((project_setups -> 0 ->> 'sprintCount')::int, 1),
        sprint_days = COALESCE((project_setups -> 0 ->> 'sprintDays')::int, 5),
        project_configured = jsonb_array_length(COALESCE(project_setups, '[]'::jsonb)) > 0
    `);
    await queryRunner.query(`ALTER TABLE users DROP COLUMN IF EXISTS project_setups`);
  }
}
