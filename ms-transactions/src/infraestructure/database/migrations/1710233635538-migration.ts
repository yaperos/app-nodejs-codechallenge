import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1710233635538 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                CREATE TABLE IF NOT EXISTS "transaction_status" (
                    "id" SERIAL PRIMARY KEY,
                    "name" VARCHAR NOT NULL UNIQUE
                )
            `);

    await queryRunner.query(`
                CREATE TABLE IF NOT EXISTS "transaction_type" (
                    "id" SERIAL PRIMARY KEY,
                    "name" VARCHAR NOT NULL UNIQUE
                )
            `);

    await queryRunner.query(`
                INSERT INTO "transaction_type" ("id", "name")
                VALUES (1, 'DEBIT'), (2, 'CREDIT')
            `);

    await queryRunner.query(`
                INSERT INTO "transaction_status" ("id", "name")
                VALUES (1, 'PENDING'), (2, 'ACCEPTED'), (3, 'REJECTED')
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transaction_status"`);
  }
}
