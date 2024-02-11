import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionModel } from '../domain/models/transaction.model';
import { CreateTransactionInput } from '../domain/dto/create-transaction.input';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DepositCommand } from './deposit/DepositCommand';
import { FindDepositQuery } from './find/FindDepositQuery';
import { FindTransactionArgs } from '../domain/dto/find-transaction.args';

@Resolver(() => TransactionModel)
export class TransactionResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Mutation(() => TransactionModel)
  createTransaction(
    @Args('createTransactionInput')
    {
      accountExternalIdDebit,
      accountExternalIdCredit,
      typeId,
      value,
    }: CreateTransactionInput,
  ) {
    const command = new DepositCommand(
      accountExternalIdDebit,
      accountExternalIdCredit,
      typeId,
      value,
    );
    return this.commandBus.execute(command);
  }

  @Query(() => TransactionModel)
  findOne(@Args() { transactionId }: FindTransactionArgs) {
    const query = new FindDepositQuery(transactionId);
    return this.queryBus.execute(query);
  }
}
