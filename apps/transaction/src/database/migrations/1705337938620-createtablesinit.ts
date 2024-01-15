import { MigrationInterface, QueryRunner } from "typeorm";

export class Createtablesinit1705337938620 implements MigrationInterface {
    name = 'Createtablesinit1705337938620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_type" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transactionExternalId" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountExternalIdDebit" uuid NOT NULL, "accountExternalIdCredit" uuid NOT NULL, "value" numeric NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "transactionStatusId" integer NOT NULL, "tranferTypeId" integer NOT NULL, CONSTRAINT "PK_0b77df5ec45e0e6a8087dff82c9" PRIMARY KEY ("id", "transactionExternalId"))`);
        await queryRunner.query(`CREATE INDEX "idx_transaction_created_at" ON "transaction" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "idx_transaction_value" ON "transaction" ("value") `);
        await queryRunner.query(`CREATE INDEX "idx_transaction_status_name" ON "transaction" ("transactionStatusId") `);
        await queryRunner.query(`CREATE INDEX "idx_transaction_type_name" ON "transaction" ("tranferTypeId") `);
        await queryRunner.query(`CREATE TABLE "transaction_status" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_acb226c33f2e9022e76d04ca1dc" FOREIGN KEY ("transactionStatusId") REFERENCES "transaction_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_8e2274441c9515105019570ef79" FOREIGN KEY ("tranferTypeId") REFERENCES "transaction_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_8e2274441c9515105019570ef79"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_acb226c33f2e9022e76d04ca1dc"`);
        await queryRunner.query(`DROP TABLE "transaction_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_transaction_type_name"`);
        await queryRunner.query(`DROP INDEX "public"."idx_transaction_status_name"`);
        await queryRunner.query(`DROP INDEX "public"."idx_transaction_value"`);
        await queryRunner.query(`DROP INDEX "public"."idx_transaction_created_at"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "transaction_type"`);
    }

}
