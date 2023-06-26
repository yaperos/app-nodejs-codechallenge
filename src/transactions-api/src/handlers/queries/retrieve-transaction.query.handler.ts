import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Transaction } from 'src/models/transaction.entity';
import { RetrieveTransactionQuery } from './retrieve-transaction.query';
import { NotFoundException } from '@nestjs/common';
import { isEmpty, isNull, isUndefined, omitBy } from 'lodash';
import { RedisCacheService } from 'src/services/redis-cache.service';
import { InjectRepository } from '@nestjs/typeorm';

@QueryHandler(RetrieveTransactionQueryHandler)
export class RetrieveTransactionQueryHandler
  implements IQueryHandler<RetrieveTransactionQuery, Transaction>
{
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(query: RetrieveTransactionQuery): Promise<Transaction> {
    try {
      const queryValues = omitBy(query, isUndefined || isNull || isEmpty);
      const cacheKey = queryValues[Object.keys(queryValues)[0]];

      const cachedTransaction = (await this.cache.get(cacheKey)) as Transaction;

      if (cachedTransaction) {
        return cachedTransaction;
      }

      const transaction = await this.transactionRepository.findOne({
        where: queryValues,
      });

      if (!transaction) {
        throw new NotFoundException(`Transaction with id ${query} not found`);
      }

      await this.cache.set(cacheKey, transaction);

      return transaction;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
