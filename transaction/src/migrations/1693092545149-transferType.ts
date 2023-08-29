import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransferType1693092545149 implements MigrationInterface {
  name = 'TransferType1693092545149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transfers_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c2b8abd3ea641960166b4a99369" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transfers_types"`);
  }
}
