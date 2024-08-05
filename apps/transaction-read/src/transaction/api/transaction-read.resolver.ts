import { Resolver, Query, Args } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import {
  SearchTransactionRequest,
  SearchTransactionResponse,
} from '../application/dtos/search-transaction.dto';
import { SearchTransactionQuery } from '../application/queries/search-transaction/search-transaction.query';

@Resolver()
export class TransactionReadResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => [SearchTransactionResponse], {
    name: 'searchTransactions',
  })
  async searchTransactions(
    @Args('searchTransactionRequest')
    searchTransactionRequest: SearchTransactionRequest,
  ): Promise<SearchTransactionResponse[]> {
    return await this.queryBus.execute(
      new SearchTransactionQuery(searchTransactionRequest),
    );
  }
}
