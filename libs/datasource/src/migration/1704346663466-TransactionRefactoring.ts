import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionRefactoring1704346663466 implements MigrationInterface {
    name = 'TransactionRefactoring1704346663466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"
            ALTER COLUMN "createdAt"
            SET DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "transaction"
            ALTER COLUMN "updatedAt"
            SET DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "transaction"
            ALTER COLUMN "updatedAt" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "transaction"
            ALTER COLUMN "createdAt" DROP DEFAULT
        `);
    }

}
