import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TransactionOutput } from '../dtos/transaction.output';
import { TransactionFinder } from '../use-cases/transaction-finder.use-case';
import { GetTransactionQuery } from './get-transaction.query';

@QueryHandler(GetTransactionQuery)
export class GetTransactionQueryHandler
  implements IQueryHandler<GetTransactionQuery>
{
  constructor(private transactionFinder: TransactionFinder) {}

  async execute(query: GetTransactionQuery): Promise<TransactionOutput> {
    const transaction = await this.transactionFinder.run(query.getCriteria());
    return TransactionOutput.fromTransaction(transaction);
  }
}
