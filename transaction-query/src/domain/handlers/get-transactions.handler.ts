import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ITransactionRepository } from '../ports';
import { GetTransactionsQuery } from '../querys';

@Injectable()
@QueryHandler(GetTransactionsQuery)
export class GetTransactionsHandler
  implements IQueryHandler<GetTransactionsQuery>
{
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private readonly repository: ITransactionRepository,
  ) {}
  execute(): Promise<any[]> {
    return this.repository.findAll();
  }
}
