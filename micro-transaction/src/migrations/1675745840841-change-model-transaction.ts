import { MigrationInterface, QueryRunner } from "typeorm";

export class changeModelTransaction1675745840841 implements MigrationInterface {
    name = 'changeModelTransaction1675745840841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "PK_9c4c395f2216da23783a980d0dc"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "id_transaction"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "id_transaction" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "PK_9c4c395f2216da23783a980d0dc" PRIMARY KEY ("id_transaction")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "PK_9c4c395f2216da23783a980d0dc"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "id_transaction"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "id_transaction" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "PK_9c4c395f2216da23783a980d0dc" PRIMARY KEY ("id_transaction")`);
    }

}
