import { Args, Query, Resolver } from '@nestjs/graphql';
import { FindTransactionsWithPagination } from '../FindTransactionsWithPagination';
import { PaginatedTransactionsOutput } from '../graphql/output/FindTransactionsOutput';
import { FindTransactionsInput } from '../graphql/input/FindTransactionsInput';
import { Transaction } from 'src/modules/transaction/domain/Transaction';

@Resolver()
export class FindTransactionsWithPaginationResolver {
  constructor(private readonly useCase: FindTransactionsWithPagination) {}

  @Query(() => PaginatedTransactionsOutput)
  async getTransactionsWithPagination(
    @Args('input') input: FindTransactionsInput,
  ) {
    const result = await this.useCase.run(input);
    const { items, ...pagination } = result;
    return {
      ...pagination,
      items: items.map((item) => Transaction.toPrimitives(item)),
    };
  }
}
