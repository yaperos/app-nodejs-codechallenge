import { MigrationInterface, QueryRunner } from "typeorm";

export class Cambiocampo1722501369505 implements MigrationInterface {
    name = 'Cambiocampo1722501369505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "tranferTypeId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "tranferTypeId" integer NOT NULL`);
    }

}
