import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Transaction } from 'src/models/transaction.entity';
import { RetrieveTransactionQuery } from './retrieve-transaction.query';
import { NotFoundException } from '@nestjs/common';
import { isEmpty, isNull, isUndefined, omitBy } from 'lodash';
import { RedisCacheService } from 'src/services/redis-cache.service';

@QueryHandler(RetrieveTransactionQuery)
export class RetrieveTransactionHandler
  implements IQueryHandler<RetrieveTransactionQuery, Transaction>
{
  constructor(
    private readonly transactionRepository: Repository<Transaction>,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(query: RetrieveTransactionQuery): Promise<Transaction> {
    try {
      const cachedTransaction = (await this.cache.get(
        query.transferExternalId,
      )) as Transaction;

      if (cachedTransaction) {
        return cachedTransaction;
      }

      const transaction = await this.transactionRepository.findOne({
        where: omitBy(query, isUndefined || isNull || isEmpty),
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction with id ${query} not found`);
      }

      await this.cache.set(query.transferExternalId, transaction);

      return transaction;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
