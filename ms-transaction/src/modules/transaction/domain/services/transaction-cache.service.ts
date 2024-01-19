import { Injectable, Logger } from '@nestjs/common';
import { AggregateCacheService } from 'src/modules/shared/domain/services/aggregate-cache.service';

import { Transaction } from '../transaction';

@Injectable()
export class TransactionCacheService {
  private readonly logger = new Logger(TransactionCacheService.name);

  constructor(
    private readonly aggregateCacheService: AggregateCacheService<Transaction>,
  ) {}

  async get(transactionId: string): Promise<Transaction | null> {
    try {
      const transactionValues = await this.aggregateCacheService.get(
        this.getKey(transactionId),
      );
      return transactionValues
        ? Transaction.fromPrimitives({
            ...transactionValues,
            createdAt: new Date(transactionValues.createdAt),
            updatedAt: new Date(transactionValues.updatedAt),
          })
        : null;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `function get with param: ${transactionId}`,
      );
      return null;
    }
  }

  async set(transaction: Transaction) {
    try {
      await this.aggregateCacheService.set(
        this.getKey(transaction.getId()),
        transaction,
      );
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `function set with param: ${JSON.stringify(transaction)}`,
      );
    }
  }

  async delete(transactionId: string): Promise<void> {
    try {
      await this.aggregateCacheService.delete(this.getKey(transactionId));
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `function delete with param: ${transactionId}`,
      );
    }
  }

  private getKey(transactionId: string) {
    return `Transaction#${transactionId}`;
  }
}
