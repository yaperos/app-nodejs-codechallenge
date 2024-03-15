import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DateTime } from 'luxon';
import { ITransactionRepository } from '../../../domain/repositories/database/ITransactionRepository';
import { TransactionModel } from '../../../domain/model/Transaction.model';
import { TransactionEntity } from '../entities/Transaction.entity';
import { DatabaseTransactionStatus } from '../../../domain/enums/DatabaseTransactionStatus';
import { ConfigService } from '@nestjs/config';
import { TransactionDetailModel } from '../../../domain/model/TransactionDetail.model';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    private readonly config: ConfigService,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

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

  async updateTransactionStatus(
    id: string,
    statusId: number,
  ): Promise<DatabaseTransactionStatus> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource
        .getRepository(TransactionEntity)
        .createQueryBuilder()
        .update()
        .set({
          transactionStatusId: statusId,
          updatedAt: DateTime.now().setZone(
            this.config.get<string>('TIMEZONE'),
          ),
        })
        .where('transactionExternalId = :id', { id })
        .execute();

      await queryRunner.commitTransaction();

      return DatabaseTransactionStatus.COMPLETED;
    } catch (err) {
      Logger.error('Error updating transaction', err.message);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return DatabaseTransactionStatus.REJECTED;
  }

  async findTransactionById(id: string): Promise<TransactionDetailModel> {
    try {
      const transaction = await this.dataSource
        .getRepository(TransactionEntity)
        .createQueryBuilder('transactions')
        .select([
          'transactions.transactionExternalId',
          'transactions.value',
          'transactions.createdAt',
          'transactionType.name',
          'transactionStatus.name',
        ])
        .innerJoin('transactions.transactionType', 'transactionType')
        .innerJoin('transactions.transactionStatus', 'transactionStatus')
        .where('transactions.transaction_external_id = :id', { id })
        .getOne();

      return {
        transactionExternalId: transaction.transactionExternalId,
        transactionStatus: transaction.transactionStatus,
        transactionType: transaction.transactionType,
        value: transaction.value,
        createdAt: DateTime.fromISO(
          transaction.createdAt.toISOString(),
        ).toFormat('yyyy-MM-dd HH:mm:ss'),
      };
    } catch (err) {
      Logger.error('Error getting transaction by id', err.message);
    }

    return null;
  }
}
