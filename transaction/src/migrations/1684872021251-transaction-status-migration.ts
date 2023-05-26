import { MigrationInterface, QueryRunner } from "typeorm"
import { TransactionStatus } from 'src/transactions/entities/transaction-status.entity';

export class TransactionStatusMigration1684872021251 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const GBP = await queryRunner.manager.save(
            queryRunner.manager.create<TransactionStatus>(TransactionStatus, [
                {
                    id: 1,
                    name: 'pending'
                },
                {
                    id: 2,
                    name: 'approved'
                },
                {
                    id: 3,
                    name: 'rejected'
                }
            ]),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE * FROM transaction_status`);
    }

}