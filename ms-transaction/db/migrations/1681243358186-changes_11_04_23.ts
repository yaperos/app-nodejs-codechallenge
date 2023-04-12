import { MigrationInterface, QueryRunner } from "typeorm";

export class Changes1104231681243358186 implements MigrationInterface {
    name = 'Changes1104231681243358186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_0e57c323890648df9aa92e57a34"`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "transactionTypeId" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_0e57c323890648df9aa92e57a34" FOREIGN KEY ("transactionTypeId") REFERENCES "transaction_type"("transactionTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_0e57c323890648df9aa92e57a34"`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "transactionTypeId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_0e57c323890648df9aa92e57a34" FOREIGN KEY ("transactionTypeId") REFERENCES "transaction_type"("transactionTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
