import { randomUUID } from 'crypto';
import { Surreal } from 'surrealdb.js';
import { Logger } from 'winston';

import {
  Transaction,
  TransactionInsertData,
  TransactionRepository,
  TransactionStatus,
  TransactionUpdateData,
} from '../../../core/domain';
import { logger } from '../../di';

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

  async update(id: string, data: TransactionUpdateData): Promise<Transaction> {
    const queryResults = await this.client.query(
      `
      $transaction = UPDATE type::thing($id) SET 
        status = $status
        ${data.annotations ? ', annotations = $annotations' : ''};
      
      SELECT 
        *, (select id, name from only $transaction.transactionType) as transactionType 
      FROM ONLY $transaction;
      `,
      { annotations: data.annotations, id, status: data.status },
    );

    const result = queryResults.reduce(
      (transaction: Transaction | null, queryResult) => {
        if (queryResult.status === 'ERR') {
          logger.error('DB_ERROR', { ...queryResult });
          return null;
        }

        if (queryResult.status === 'OK' && queryResult.result) {
          return queryResult.result as Transaction;
        }

        return null;
      },
      null as Transaction | null,
    );

    if (!result) {
      throw new Error('ERROR_UPDATING_TRANSACTION');
    }

    return result;
  }
}
