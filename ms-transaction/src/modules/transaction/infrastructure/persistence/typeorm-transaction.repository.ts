import { Injectable } from '@nestjs/common';
import { TypeOrmRepository } from 'src/modules/shared/infrastructure/persistence/typeorm/typeorm.repository';
import { Transaction } from 'src/modules/transaction/domain/transaction';
import { TransactionRepository } from 'src/modules/transaction/domain/transaction.repository';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';
import { TransactionNotFoundError } from 'src/modules/transaction/domain/transaction-not-found.error';
import { Transactions } from 'src/modules/transaction/domain/transactions';
import { DataSource, EntityTarget, SelectQueryBuilder } from 'typeorm';

import { TypeOrmTransactionEntity as TransactionEntity } from './typeorm-transaction.entity';

@Injectable()
export class TypeOrmTransactionRepository
  extends TypeOrmRepository<TransactionEntity>
  implements TransactionRepository
{
  constructor(dataSource: DataSource) {
    const fieldMapper = new Map<string, string>();

    super(dataSource, fieldMapper);
  }

  protected entity(): EntityTarget<TransactionEntity> {
    return TransactionEntity;
  }

  async createTransaction(transaction: Transaction): Promise<void> {
    await this.create(transaction.toPrimitives());
  }

  async updateTransaction(transaction: Transaction): Promise<void> {
    transaction.markAsUpdated();

    const affected = await this.update(
      transaction.getId(),
      transaction.toPrimitives(),
    );

    if (affected != 1) {
      throw new TransactionNotFoundError();
    }
  }

  async findOneTransactionBy(
    transactionCriteria: TransactionCriteria,
  ): Promise<Transaction | null> {
    const transactionEntity =
      await this.createQueryBuilderByTransactionCriteria(
        transactionCriteria,
      ).getOne();

    return transactionEntity
      ? Transaction.fromPrimitives({ ...transactionEntity })
      : null;
  }

  async findTransactionsBy(
    transactionCriteria: TransactionCriteria,
  ): Promise<Transactions> {
    const transactionEntities =
      await this.createQueryBuilderByTransactionCriteria(
        transactionCriteria,
      ).getMany();

    return new Transactions(
      transactionEntities.map((transactionEntity) =>
        Transaction.fromPrimitives({ ...transactionEntity }),
      ),
    );
  }

  async countTransactions(
    transactionCriteria: TransactionCriteria,
  ): Promise<number> {
    return this.createQueryBuilderByTransactionCriteria(
      transactionCriteria,
    ).getCount();
  }

  private createQueryBuilderByTransactionCriteria(
    criteria: TransactionCriteria,
  ): SelectQueryBuilder<TransactionEntity> {
    return this.createQueryBuilderByCriteria(criteria);
  }
}
