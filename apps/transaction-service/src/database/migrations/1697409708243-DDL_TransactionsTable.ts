import { MigrationInterface, QueryRunner } from 'typeorm';

export class DDLTransactionsTable1697409708243 implements MigrationInterface {
  name = 'DDLTransactionsTable1697409708243';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" BIGSERIAL NOT NULL, "transaction_external_id" uuid NOT NULL, "account_external_id_debit" uuid, "account_external_id_credit" uuid, "value" integer NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "transaction_type_id" integer, "transaction_status_id" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_status" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_98271e4a83052aeca9aa11fd3ca" FOREIGN KEY ("transaction_type_id") REFERENCES "transaction_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_df972d66ba089168f1ffb0831ca" FOREIGN KEY ("transaction_status_id") REFERENCES "transaction_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_df972d66ba089168f1ffb0831ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_98271e4a83052aeca9aa11fd3ca"`,
    );
    await queryRunner.query(`DROP TABLE "transaction_status"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "transaction_type"`);
  }
}
