import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Transaction } from 'src/models/transaction.entity';
import { RetrieveTransactionQuery } from './retrieve-transaction.query';
import { NotFoundException } from '@nestjs/common';
import { isEmpty, isNull, isUndefined, omitBy } from 'lodash';
import { RedisCacheService } from 'src/services/redis-cache.service';
import { InjectRepository } from '@nestjs/typeorm';

@QueryHandler(RetrieveTransactionQuery)
export class RetrieveTransactionQueryHandler
  implements IQueryHandler<RetrieveTransactionQuery, Transaction[]>
{
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly cache: RedisCacheService,
  ) {}

  async execute(query: RetrieveTransactionQuery): Promise<Transaction[]> {
    try {

        console.info('query', query);

        const whereClause = {
            accountExternalId: query.transferExternalId,
            transactionType: query.transactionType,
            status: query.transactionStatus,
            value: query.value,            
            createdAt: query.createdAt,
        };

      const queryValues = omitBy(whereClause, isUndefined || isNull || isEmpty);

      console.info('queryValues', queryValues);

      const transactions = await this.transactionRepository.find({
        where: queryValues,
      });

      console.info('transactions', transactions);

      if (!transactions) {
        console.error('Transaction not found');
        return [] as Transaction[];
      }

      return transactions;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
