import { MigrationInterface, QueryRunner } from "typeorm";

export class Transaction1693612254918 implements MigrationInterface {
    name = 'Transaction1693612254918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Transactions" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountExternalIdDebit" character varying(36) NOT NULL, "accountExternalIdCredit" character varying(36) NOT NULL, "tranferTypeId" smallint NOT NULL, "value" numeric(10,2) NOT NULL, "status" smallint NOT NULL DEFAULT '1', CONSTRAINT "PK_7761bf9766670b894ff2fdb3700" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "TypesTransaction" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "version" integer NOT NULL, "id" smallint GENERATED ALWAYS AS IDENTITY NOT NULL, "value" numeric(10,2) NOT NULL, CONSTRAINT "PK_e78eab3dce771f3beec9c370720" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "TypesTransaction"`);
        await queryRunner.query(`DROP TABLE "Transactions"`);
    }

}
