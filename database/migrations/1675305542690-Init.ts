import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1675305542690 implements MigrationInterface {
    name = 'Init1675305542690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(100) NOT NULL, "password" character varying(500) NOT NULL, "email" character varying(500) NOT NULL, "active" boolean NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tx" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" integer NOT NULL, "value" integer NOT NULL, "created_at" TIMESTAMP NOT NULL, "status" integer NOT NULL, "user_debit_id" uuid, "user_credit_id" uuid, CONSTRAINT "PK_2e04a1db73a003a59dcd4fe916b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tx" ADD CONSTRAINT "FK_cab8bd18ec49753036b74c533ab" FOREIGN KEY ("user_debit_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tx" ADD CONSTRAINT "FK_496880a4dff100ee8e92b3a2881" FOREIGN KEY ("user_credit_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tx" DROP CONSTRAINT "FK_496880a4dff100ee8e92b3a2881"`);
        await queryRunner.query(`ALTER TABLE "tx" DROP CONSTRAINT "FK_cab8bd18ec49753036b74c533ab"`);
        await queryRunner.query(`DROP TABLE "tx"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
