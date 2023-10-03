import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserRole1696306196663 implements MigrationInterface {
  name = 'UpdateUserRole1696306196663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`role\`
        `);
  }
}
