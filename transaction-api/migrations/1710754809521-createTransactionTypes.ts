import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionTypes1710754809521 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `INSERT INTO transaction_type (name) VALUES ('transfer'),
            ('deposit'), ('withdrawal')`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM transaction_type WHERE name in ('transfer','deposit','withdrawal')`,
        )
    }

}
