import { MigrationInterface, QueryRunner } from "typeorm";

export class Transaction1669056180812 implements MigrationInterface {
    name = 'Transaction1669056180812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "name" character varying NOT NULL DEFAULT '', "tranferTypeId" character varying NOT NULL DEFAULT '', "value" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transaction"`);
    }

}
