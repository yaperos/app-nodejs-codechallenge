import TransactionEntity from '@context/transactions/infrastructure/entities/TransactionEntity';
import { ITransactionRepository } from '@context/transactions/domain/contracts/ITransactionRepository';
import { BaseRepository } from '@context/shared/infrastructure/persistence/typeorm/repositories/BaseRepository';
import Transaction from '@context/transactions/domain/class/Transaction';
import Logger from '@context/shared/infrastructure/impl/WinstonInfoLogger';

export class TransactionRepository extends BaseRepository<TransactionEntity> implements ITransactionRepository {
  constructor() {
    const entity = TransactionEntity;
    super(entity);
  }

  async findByExternalId(externalId: number): Promise<Transaction> {
    const transaction = await this.getByTransactionExternalId(externalId);
    if (!transaction) {
      throw new Error(`Error: -> <TransactionRepository> findByExternalId - transaction: ${JSON.stringify(transaction)}`);
    }
    return transaction;
  }

  async createTransaction(transaction: Transaction): Promise<string> {
    let transactionCreated = null;
    try {
      transactionCreated = await this.create(transaction);
    } catch (error) {
      Logger.info(`Error: -> <TransactionRepository> createTransaction Catch - transaction: ${JSON.stringify(error)}`);
    }

    if (!transactionCreated?.id) {
      throw new Error(`Error: -> <TransactionRepository> createTransaction - transaction: ${JSON.stringify(transactionCreated)}`);
    }

    return transactionCreated.id!;
  }

  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    let transactionCreated = null;
    try {
      transactionCreated = await this.upsert(transaction);
    } catch (error) {
      Logger.info(`Error: ${JSON.stringify(error)}`);
    }

    if (!transactionCreated?.id) {
      throw new Error(`Error: -> <TransactionRepository> updateTransaction - transaction: ${JSON.stringify(transactionCreated)}`);
    }

    return transaction;
  }
}
