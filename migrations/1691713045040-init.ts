import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1691713045040 implements MigrationInterface {
    name = 'Init1691713045040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_external_id_debit" character varying NOT NULL, "account_external_id_credit" character varying NOT NULL, "transfer_type_id" integer NOT NULL, "value" integer NOT NULL, "transaction_status" character varying NOT NULL DEFAULT 'pendiente', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transaction"`);
    }

}
