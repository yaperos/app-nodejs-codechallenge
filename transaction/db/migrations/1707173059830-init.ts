import { MigrationInterface, QueryRunner } from 'typeorm';

// Dado que esta tabla se utiliza para inserciones, podríamos aprovecharla como un sistema de event sourcing
// proporcionando una valiosa funcionalidad para auditoría, especialmente crítica en el contexto de datos bancarios.

export class Init1707173059830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SET extra_float_digits = 3;');

    await queryRunner.query(`
        CREATE TABLE "transaction" (
          "id" BIGSERIAL NOT NULL,
          "transactionId" uuid NOT NULL,
          "accountExternalIdDebit" character varying NULL,
          "accountExternalIdCredit" character varying NULL,
          "transactionTypeId" integer NULL,
          "value" numeric NULL,
          "status" character varying NULL,
          "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")
  )
`);
    await queryRunner.query(
      `CREATE INDEX "IDX_transaction_accountExternalIdCredit" ON "transaction" ("accountExternalIdCredit") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transaction_accountExternalIdDebit" ON "transaction" ("accountExternalIdDebit") `,
    );
    await queryRunner.query(
      `CREATE INDEX "transactionTypeId" ON "transaction" ("transactionTypeId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transaction_transactionId" ON "transaction" ("transactionId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
