import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1687455469583 implements MigrationInterface {
    name = 'InitMigration1687455469583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "financial_transaction" ("id" SERIAL NOT NULL, "transaction_external_id" uuid NOT NULL, "account_external_id_debit" uuid NOT NULL, "account_external_id_credit" uuid NOT NULL, "tranfer_type_id" integer NOT NULL, "value" numeric(10,2) NOT NULL, "transaction_status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_416074dbe39e9f3feb05dec80cb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "financial_transaction"`);
    }

}
