import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1699031328396 implements MigrationInterface {
    name = 'Init1699031328396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "accountExternalIdDebit" character varying(100) NOT NULL, "accountExternalIdCredit" character varying(100) NOT NULL, "tranferTypeId" numeric NOT NULL, "value" numeric NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
    }

}
