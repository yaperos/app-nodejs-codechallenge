import { TransactionStatus } from "src/infrastructure/entities/transaction-status.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionStatusSeed1675086728402 implements MigrationInterface{
    name = 'TransactionStatusSeed1675086728402';
    transaction?: boolean;
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.manager.save(
            queryRunner.manager.create<TransactionStatus>(TransactionStatus, {
                id : 1,
                description: 'Pending'
            }));
        await queryRunner.manager.save(
            queryRunner.manager.create<TransactionStatus>(TransactionStatus, {
                id : 2,
                description: 'Approved'
            }));
        await queryRunner.manager.save(
            queryRunner.manager.create<TransactionStatus>(TransactionStatus, {
                id : 3,
                description: 'Rejected'
            }));
    }
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.manager.delete(TransactionStatus, { id: 1});
        await queryRunner.manager.delete(TransactionStatus, { id: 2});
        await queryRunner.manager.delete(TransactionStatus, { id: 3});
    }
    
}