import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

/* Project */
import { RetrieveTransactionTypesQuery } from '../impl/retrieve-transaction-types.query';
import {
  ITransactionTypeRepository,
  TRANSACTION_TYPE_REPOSITORY,
} from '../../repositories';
import { TransactionType } from '../../models';

@QueryHandler(RetrieveTransactionTypesQuery)
export class RetrieveTransactionTypesHandler
  implements IQueryHandler<RetrieveTransactionTypesQuery>
{
  constructor(
    @Inject(TRANSACTION_TYPE_REPOSITORY)
    private readonly repo: ITransactionTypeRepository,
  ) {}

  async execute(): Promise<TransactionType[]> {
    return await this.repo.findAll();
  }
}
