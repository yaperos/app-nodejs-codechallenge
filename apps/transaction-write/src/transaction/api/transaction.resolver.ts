import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '../application/commands/create-transaction/create-transaction.command';
import { CreateTransactionRequest } from '../application/dtos/create-transaction.dto';
import { CreateTransactionResponse } from '../application/dtos/create-transaction-response.dto';

@Resolver()
export class TransactionResolver {
  constructor(private readonly commandBus: CommandBus) {}
  @Mutation(() => CreateTransactionResponse)
  async createTransaction(
    @Args('createTransactionRequest')
    createTransactionRequest: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    return await this.commandBus.execute(
      new CreateTransactionCommand(createTransactionRequest),
    );
  }
  @Query(() => String)
  placeholderQuery(): string {
    return 'Placeholder query';
  }
}
