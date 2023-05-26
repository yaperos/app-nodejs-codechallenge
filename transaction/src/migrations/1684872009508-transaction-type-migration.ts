import { MigrationInterface, QueryRunner } from "typeorm"
import { TransactionType } from 'src/transactions/entities/transaction-type.entity';

export class TransactionTypeMigration1684872009508 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const GBP = await queryRunner.manager.save(
            queryRunner.manager.create<TransactionType>(TransactionType, [
                {
                    id: 1,
                    name: 'incoming'
                },
                {
                    id: 2,
                    name: 'outcoming'
                }
            ]),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE * FROM transaction_type`);
    }

}

