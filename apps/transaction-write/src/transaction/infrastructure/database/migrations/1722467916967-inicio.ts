import { MigrationInterface, QueryRunner } from "typeorm";

export class Inicio1722467916967 implements MigrationInterface {
    name = 'Inicio1722467916967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction_status" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction_type" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transactionExternalId" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountExternalIdDebit" uuid NOT NULL, "accountExternalIdCredit" uuid NOT NULL, "value" numeric NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "transactionStatusId" integer NOT NULL, "transactionTypeId" integer NOT NULL, "tranferTypeId" integer NOT NULL, CONSTRAINT "PK_0b77df5ec45e0e6a8087dff82c9" PRIMARY KEY ("id", "transactionExternalId"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_acb226c33f2e9022e76d04ca1dc" FOREIGN KEY ("transactionStatusId") REFERENCES "transaction_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_0e57c323890648df9aa92e57a34" FOREIGN KEY ("transactionTypeId") REFERENCES "transaction_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_0e57c323890648df9aa92e57a34"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_acb226c33f2e9022e76d04ca1dc"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "transaction_type"`);
        await queryRunner.query(`DROP TABLE "transaction_status"`);
    }

}
