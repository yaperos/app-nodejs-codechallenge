import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { RetrieveTransactionQuery } from 'src/handlers/queries/retrieve-transaction.query';
import { Transaction } from 'src/models/transaction.entity';
import { TransferRequest } from 'src/types/transfer-request';

@Resolver()
export class TransactionResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => [Transaction])
  async transactions(
    @Args('query') query: TransferRequest,
  ): Promise<Transaction[]> {
    return await this.queryBus.execute(
      new RetrieveTransactionQuery(
        query.transferExternalId,
        query.transactionType.name,
        query.transactionStatus.name,
        query.value,
        query.createdAt,
      ),
    );
  }
}
