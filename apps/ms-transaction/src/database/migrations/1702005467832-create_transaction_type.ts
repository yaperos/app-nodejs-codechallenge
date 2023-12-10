import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactionType1702005467832 implements MigrationInterface {
  name = 'CreateTransactionType1702005467832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction_types" ("id" SERIAL NOT NULL, "name" character varying(60) NOT NULL, CONSTRAINT "UNIQUE_NAME_TRANSACTION_TYPE" UNIQUE ("name"), CONSTRAINT "PK_2a49fe7879bf8a02812639cea61" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transaction_types"`);
  }
}
