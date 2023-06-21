import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransactionsRelatedTables1687321053177
  implements MigrationInterface
{
  name = 'CreateTransactionsRelatedTables1687321053177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transfer_type" ("id" SERIAL NOT NULL, "name" character varying(15) NOT NULL, CONSTRAINT "PK_e8079532c19bb535c33902388f1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transfer_type_id" ON "transfer_type" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_status" ("id" SERIAL NOT NULL, "name" character varying(15) NOT NULL, CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transaction_status_id" ON "transaction_status" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_external_id_debit" uuid NOT NULL, "account_external_id_credit" uuid NOT NULL, "transfer_type_id" integer NOT NULL, "transaction_status_id" integer NOT NULL, "value" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transaction_id" ON "transaction" ("id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_065ab1a8dfaf0cf5e338a1fe89f" FOREIGN KEY ("transfer_type_id") REFERENCES "transfer_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_065ab1a8dfaf0cf5e338a1fe89f"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_transaction_id"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_transaction_status_id"`);
    await queryRunner.query(`DROP TABLE "transaction_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_transfer_type_id"`);
    await queryRunner.query(`DROP TABLE "transfer_type"`);
  }
}
