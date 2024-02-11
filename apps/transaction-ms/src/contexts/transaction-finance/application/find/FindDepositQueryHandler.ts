import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindDepositQuery } from './FindDepositQuery';
import { Inject, NotFoundException } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from '../../token_repository.di';
import { TransactionRepository } from '../../domain/TransactionRepository';
import { TransactionModel } from '@transaction/src/contexts/transaction-finance/domain/models/transaction.model';

@QueryHandler(FindDepositQuery)
export class FindDepositQueryHandler
  implements IQueryHandler<FindDepositQuery>
{
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute({
    transactionExternalId,
  }: FindDepositQuery): Promise<Partial<TransactionModel>> {
    const result = await this.transactionRepository.find(transactionExternalId);
    if (typeof result === typeof null) throw new NotFoundException();
    return result;
  }
}
