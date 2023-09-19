import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATETRANSACTION1695139247995 implements MigrationInterface {
    name = 'CREATETRANSACTION1695139247995'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "transactionExternalId" character varying NOT NULL, "accountExternalIdDebit" character varying NOT NULL, "accountExternalIdCredit" character varying NOT NULL, "tranferTypeId" integer NOT NULL, "value" integer NOT NULL, "transactionType" character varying NOT NULL, "transactionStatus" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transaction"`);
    }

}
