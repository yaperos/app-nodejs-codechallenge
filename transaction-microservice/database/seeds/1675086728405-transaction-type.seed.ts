import { TransactionType } from "src/infrastructure/entities/transaction-type.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class TransactionType1675086728405 implements MigrationInterface{
    name = 'TransactionType1675086728405';
    transaction?: boolean;
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.manager.save(
            queryRunner.manager.create<TransactionType>(TransactionType, {
                id : 1,
                description: 'Transfer between accounts of the same bank'
            }));
        await queryRunner.manager.save(
            queryRunner.manager.create<TransactionType>(TransactionType, {
                id : 2,
                description: 'Transfer between accounts of other banks'
            }));
        await queryRunner.manager.save(
            queryRunner.manager.create<TransactionType>(TransactionType, {
                id : 3,
                description: 'Transfer to foreign accounts'
            }));
    }
    
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.manager.delete(TransactionType, { id: 1});
        await queryRunner.manager.delete(TransactionType, { id: 2});
        await queryRunner.manager.delete(TransactionType, { id: 3});
    }
    
}