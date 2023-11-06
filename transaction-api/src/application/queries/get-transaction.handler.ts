import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionQuery } from './get-transaction.query';
import { Transaction } from 'src/domain/models';
import { TransactionRepository } from 'src/domain/repositories';
import { Inject } from '@nestjs/common';

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler
  implements IQueryHandler<GetTransactionQuery, Transaction>
{
  constructor(
    @Inject(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(query: GetTransactionQuery): Promise<Transaction> {
    const transaction = await this.transactionRepository.getById(query.id);
    return transaction;
  }
}
