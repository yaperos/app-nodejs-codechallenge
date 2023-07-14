import {
  Args,
  Field,
  InputType,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TransactionModel } from '../object-types/transaction.model';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RetrieveTransactionQuery } from 'apps/transaction-ms/src/application/queries/retrieve-transaction.query';
import { TransactionTypeModel } from '../object-types/transaction-type.model';
import { TransactionEntity } from '../../../domain/entities/transaction.entity';
import { CreateTransactionCommand } from 'apps/transaction-ms/src/application/commands/create-transaction.command';

@InputType()
class CreateTransactionInput {
  @Field()
  accountExternalIdDebit: string;
  @Field()
  accountExternalIdCredit: string;
  @Field()
  transferTypeId: number;
  @Field()
  value: number;
}

@Resolver((of) => TransactionModel)
export class TransactionResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query((returns) => TransactionModel)
  async transaction(@Args('id') id: string): Promise<TransactionModel> {
    const query = new RetrieveTransactionQuery(id);
    const transaction = this.queryBus.execute(query);
    return transaction;
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

  @Mutation((returns) => TransactionModel)
  async createTransaction(
    @Args('accountExternalIdDebit') accountExternalIdDebit: string,
    @Args('accountExternalIdCredit') accountExternalIdCredit: string,
    @Args('transferTypeId') transferTypeId: number,
    @Args('value') value: number,
  ): Promise<TransactionModel> {
    console.log(
      accountExternalIdDebit,
      accountExternalIdCredit,
      transferTypeId,
      value,
    );
    const command = new CreateTransactionCommand(
      accountExternalIdDebit,
      accountExternalIdCredit,
      transferTypeId,
      value,
    );
    const transaction = await this.commandBus.execute(command);
    return transaction;
  }
}
