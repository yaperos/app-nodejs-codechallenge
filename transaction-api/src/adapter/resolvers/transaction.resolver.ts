import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTransactionInput } from '../models/create-transaction.input';
import { CreateTransactionCommand } from 'src/application/commands/create-transaction.command';
import { CreateTransactionOutput } from '../models/create-transaction.output';
import { GetTransactionQuery } from 'src/application/queries/get-transaction.query';
import { Transaction } from 'src/domain/models';
import { GetTransactionOutput } from '../models/get-transaction.output';
import { NotFoundException } from '@nestjs/common';

@Resolver()
export class TransactionsResolver {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, prettier/prettier
  @Query((type) => GetTransactionOutput)
  async getTransaction(@Args('id') id: string) {
    const transaction = await this.queryBus.execute<
      GetTransactionQuery,
      Transaction
    >(new GetTransactionQuery(id));
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} does not exist!`);
    }
    return new GetTransactionOutput(
      transaction.id,
      transaction.transferTypeName,
      transaction.transferStatusName,
      transaction.value,
      transaction.createdAt,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Mutation((returns) => CreateTransactionOutput)
  async createTransaction(@Args('input') input: CreateTransactionInput) {
    const {
      accountExternalIdCredit,
      accountExternalIdDebit,
      value,
      tranferTypeId,
    } = input;
    const transaction = await this.commandBus.execute(
      new CreateTransactionCommand(
        accountExternalIdDebit,
        accountExternalIdCredit,
        tranferTypeId,
        value,
      ),
    );
    return new CreateTransactionOutput(transaction.id);
  }
}
