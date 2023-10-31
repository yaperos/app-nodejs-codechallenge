import { randomUUID } from 'crypto';
import { Surreal } from 'surrealdb.js';
import { Logger } from 'winston';

import {
  Transaction,
  TransactionInsertData,
  TransactionRepository,
  TransactionStatus,
} from '../../../core/domain';

export class DatabaseTransactionRepository implements TransactionRepository {
  constructor(
    private readonly client: Surreal,
    private readonly logger: Logger,
  ) {}

  async insert(data: TransactionInsertData): Promise<Transaction> {
    const [{ result, status, ...queryResult }] = await this.client.query<
      [Transaction[]]
    >(`INSERT INTO transaction $data;`, {
      data: {
        accountExternalIdCredit: data.accountExternalIdCredit,
        accountExternalIdDebit: data.accountExternalIdDebit,
        externalId: randomUUID(),
        status: TransactionStatus.PENDING,
        transactionType: data.transactionType.id,
        value: data.value,
      },
    });

    const insertedTransaction = result?.[0];

    if (status === 'ERR' || !insertedTransaction) {
      this.logger.error('DB_ERROR', { result, status, ...queryResult });
      throw new Error('ERROR_WHILE_SAVING_TRANSACTION');
    }

    return {
      ...insertedTransaction,
      transactionType: data.transactionType,
    };
  }
}
