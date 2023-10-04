import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1696393959529 implements MigrationInterface {
  name = 'Init1696393959529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`fullname\` varchar(500) NOT NULL,
                \`username\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user',
                \`image\` varchar(255) NOT NULL DEFAULT 'default-avatar.jpg',
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`posts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`title\` varchar(255) NULL,
                \`content\` varchar(500) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`user_id\` int NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`posts\`
            ADD CONSTRAINT \`FK_c4f9a7bd77b489e711277ee5986\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_c4f9a7bd77b489e711277ee5986\`
        `);
    await queryRunner.query(`
            DROP TABLE \`posts\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\`
        `);
    await queryRunner.query(`
            DROP TABLE \`users\`
        `);
  }
}
