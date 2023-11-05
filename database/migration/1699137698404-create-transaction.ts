import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransaction1699137698404 implements MigrationInterface {
    name = 'CreateTransaction1699137698404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transactions" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "account_external_id_debit" character varying NOT NULL, "account_external_id_credit" character varying NOT NULL, "tranfer_type_id" integer NOT NULL, "value" integer NOT NULL, "status" character varying NOT NULL DEFAULT 'Pending', CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
