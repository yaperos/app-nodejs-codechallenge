import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ITransactionRepository } from '../../../domain/repositories/database/ITransactionRepository';
import { TransactionModel } from '../../../domain/model/Transaction.model';
import { TransactionEntity } from '../entities/Transaction.entity';
import { DatabaseTransactionStatus } from '../../../domain/enums/DatabaseTransactionStatus';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(@Inject(DataSource) private dataSource: DataSource) {}

  async createTransaction(
    transaction: TransactionModel,
  ): Promise<DatabaseTransactionStatus> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(TransactionEntity)
        .values(transaction)
        .execute();
      await queryRunner.commitTransaction();

      return DatabaseTransactionStatus.COMPLETED;
    } catch (err) {
      Logger.error('Error creating new transaction', err.message);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return DatabaseTransactionStatus.REJECTED;
  }
}
