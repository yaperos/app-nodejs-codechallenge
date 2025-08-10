import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

/* Project */
import { RetrieveTransactionTypeQuery } from '../impl/retrieve-transaction-type.query';
import {
  ITransactionTypeRepository,
  TRANSACTION_TYPE_REPOSITORY,
} from '../../repositories';
import { TransactionType } from '../../models';

@QueryHandler(RetrieveTransactionTypeQuery)
export class RetrieveTransactionTypeHandler
  implements IQueryHandler<RetrieveTransactionTypeQuery>
{
  constructor(
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly repo: ITransactionTypeRepository,
  ) {}

  async execute(
    query: RetrieveTransactionTypeQuery,
  ): Promise<TransactionType | null> {
    const { id } = query;

    return await this.repo.findById(id);
  }
}
