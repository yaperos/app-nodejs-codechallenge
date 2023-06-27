import { MigrationInterface, QueryRunner } from 'typeorm';
import { TransactionStatus, TransactionType } from '../entities/index';

export class seedTransactionTables1676435849319 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const transactionStatusRepo =
      queryRunner.connection.getRepository(TransactionStatus);

    await transactionStatusRepo.insert([
      {
        id: 1,
        name: 'pending',
      },
      {
        id: 2,
        name: 'approved',
      },
      {
        id: 3,
        name: 'rejected',
      },
    ]);

    const transactionTypeRepo =
      queryRunner.connection.getRepository(TransactionType);

    await transactionTypeRepo.insert([
      {
        id: 1,
        name: 'type-1',
      },
      {
        id: 2,
        name: 'type-2',
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const transactionStatusRepo =
      queryRunner.connection.getRepository(TransactionStatus);
    await transactionStatusRepo.clear();
    const transactionTypeRepo =
      queryRunner.connection.getRepository(TransactionType);
    await transactionTypeRepo.clear();
  }
}
