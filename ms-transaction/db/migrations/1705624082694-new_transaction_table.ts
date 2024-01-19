import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewTransactionTable1705624082694 implements MigrationInterface {
  name = 'NewTransactionTable1705624082694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_transfer_type_enum" AS ENUM('1', '2', '3')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_validation_type_enum" AS ENUM('pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL, "credit_account_external_id" uuid NOT NULL, "debit_account_external_id" uuid NOT NULL, "amount" double precision NOT NULL, "transfer_type" "public"."transaction_transfer_type_enum" NOT NULL, "validation_type" "public"."transaction_validation_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bd4c360c8e5745e921df060744" ON "transaction" ("created_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bd4c360c8e5745e921df060744"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(
      `DROP TYPE "public"."transaction_validation_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."transaction_transfer_type_enum"`,
    );
  }
}
