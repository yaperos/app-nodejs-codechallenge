import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedTransactionsOutput } from '../dtos/paginated-transactions.output';
import { TransactionsPaginator } from '../use-cases/transactions-paginator.use-case';
import { GetPaginatedTransactionsQuery } from './get-paginated-transactions.query';

@QueryHandler(GetPaginatedTransactionsQuery)
export class GetPaginatedTransactionsQueryHandler
  implements IQueryHandler<GetPaginatedTransactionsQuery>
{
  constructor(private transactionsPaginator: TransactionsPaginator) {}

  async execute(
    query: GetPaginatedTransactionsQuery,
  ): Promise<PaginatedTransactionsOutput> {
    const criteria = query.getTransactionCriteria();
    const paginatedTransactions = await this.transactionsPaginator.run(
      criteria,
    );

    return new PaginatedTransactionsOutput(paginatedTransactions, criteria);
  }
}
