import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1683216893912 implements MigrationInterface {
    name = 'FirstMigration1683216893912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "challenge_schema"."transaction_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "challenge_schema"."transaction" ("id" SERIAL NOT NULL, "transactionExternalId" character varying NOT NULL, "accountExternalIdDebit" character varying NOT NULL, "accountExternalIdCredit" character varying NOT NULL, "value" integer NOT NULL, "transactionTypeId" integer NOT NULL, "transactionStatusId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "challenge_schema"."transaction_status" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "challenge_schema"."transaction" ADD CONSTRAINT "FK_0e57c323890648df9aa92e57a34" FOREIGN KEY ("transactionTypeId") REFERENCES "challenge_schema"."transaction_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "challenge_schema"."transaction" ADD CONSTRAINT "FK_acb226c33f2e9022e76d04ca1dc" FOREIGN KEY ("transactionStatusId") REFERENCES "challenge_schema"."transaction_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "challenge_schema"."transaction" DROP CONSTRAINT "FK_acb226c33f2e9022e76d04ca1dc"`);
        await queryRunner.query(`ALTER TABLE "challenge_schema"."transaction" DROP CONSTRAINT "FK_0e57c323890648df9aa92e57a34"`);
        await queryRunner.query(`DROP TABLE "challenge_schema"."transaction_status"`);
        await queryRunner.query(`DROP TABLE "challenge_schema"."transaction"`);
        await queryRunner.query(`DROP TABLE "challenge_schema"."transaction_type"`);
    }

}
