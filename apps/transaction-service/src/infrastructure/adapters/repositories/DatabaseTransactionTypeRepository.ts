import { Surreal } from 'surrealdb.js';
import { Logger } from 'winston';

import {
  TransactionType,
  TransactionTypeRepository,
} from '../../../core/domain';

type TransactionTypeCache = Record<string, TransactionType>;

export class DatabaseTransactionTypeRepository
  implements TransactionTypeRepository
{
  private transactionTypes?: TransactionTypeCache;

  constructor(
    private readonly client: Surreal,
    private readonly logger: Logger,
  ) {}

  async getById(id: number): Promise<TransactionType | null> {
    if (!this.transactionTypes) {
      this.transactionTypes = await this.getTransactionTypes();
    }

    return this.transactionTypes[`transaction_type:${id}`] || null;
  }

  async getTransactionTypes(): Promise<TransactionTypeCache> {
    const [{ result, status, ...queryResult }] = await this.client.query<
      [TransactionType[]]
    >(`SELECT id, name FROM transaction_type;`);

    if (status === 'ERR' || !result) {
      this.logger.error('DB_ERROR', { result, status, ...queryResult });
      throw new Error('ERROR_GETTING_TRANSACTION_TYPES');
    }

    return result.reduce((prev, transactionType) => {
      prev[transactionType.id] = transactionType;

      return prev;
    }, {} as TransactionTypeCache);
  }
}
