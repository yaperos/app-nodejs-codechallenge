import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionRefactoring1704343754031 implements MigrationInterface {
    name = 'TransactionRefactoring1704343754031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."transaction_transactionstatus_enum" AS ENUM('pending', 'approved', 'rejected')
        `);
        await queryRunner.query(`
            CREATE TABLE "transaction" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "transactionExternalId" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "transactionStatus" "public"."transaction_transactionstatus_enum" NOT NULL DEFAULT 'pending',
                "transactionTypeId" integer NOT NULL,
                "accountExternalIdDebit" uuid NOT NULL,
                "accountExternalIdCredit" uuid NOT NULL,
                "value" money NOT NULL,
                "createdAt" TIMESTAMP NOT NULL,
                "updatedAt" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_e9d33ad38b57ee3c0b6af71e06" ON "transaction" ("transactionExternalId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_e9d33ad38b57ee3c0b6af71e06"
        `);
        await queryRunner.query(`
            DROP TABLE "transaction"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."transaction_transactionstatus_enum"
        `);
    }

}
