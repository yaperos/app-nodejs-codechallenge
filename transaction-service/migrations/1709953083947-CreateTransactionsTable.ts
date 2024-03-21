import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionsTable1709953083947 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE transactions (
                id UUID PRIMARY KEY,
                account_external_id_debit VARCHAR(255) NOT NULL,
                account_external_id_credit VARCHAR(255) NOT NULL,
                transfer_type_id INT NOT NULL,
                value FLOAT NOT NULL,
                status VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE transactions`);
    }

}