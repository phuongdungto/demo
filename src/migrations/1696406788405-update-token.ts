import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateToken1696406788405 implements MigrationInterface {
  name = 'UpdateToken1696406788405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`tokens\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`token\` varchar(255) NOT NULL,
                \`expired_at\` datetime NOT NULL,
                \`type\` varchar(255) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`user_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`tokens\`
            ADD CONSTRAINT \`FK_8769073e38c365f315426554ca5\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`tokens\` DROP FOREIGN KEY \`FK_8769073e38c365f315426554ca5\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tokens\`
        `);
  }
}
