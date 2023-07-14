import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TransactionModel } from '../object-types/transaction.model';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RetrieveTransactionQuery } from 'apps/transaction-ms/src/application/queries/retrieve-transaction.query';
import { TransactionTypeModel } from '../object-types/transaction-type.model';
import { TransactionEntity } from '../../../domain/entities/transaction.entity';

@Resolver((of) => TransactionModel)
export class TransactionResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query((returns) => TransactionModel)
  async transaction(@Args('id') id: string): Promise<TransactionModel> {
    const query = new RetrieveTransactionQuery(id);
    return this.queryBus.execute(query);
  }

  @ResolveField((returns) => TransactionTypeModel)
  transactionType(@Parent() transaction: TransactionEntity) {
    return transaction.transferType;
  }

  @ResolveField((returns) => TransactionTypeModel)
  transactionStatus(@Parent() transaction: TransactionEntity) {
    return { name: transaction.transactionStatus };
  }

  @ResolveField((returns) => Date)
  createdAt(@Parent() transaction: TransactionEntity) {
    return new Date(transaction.createdAt);
  }
}
