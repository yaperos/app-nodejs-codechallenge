import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './input/create-transaction.input';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Resolver()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => TransactionResponseDto)
  async createTransaction(
    @Args('input') input: CreateTransactionInput
  ): Promise<TransactionResponseDto> {
    return this.transactionService.createTransaction(input);
  }

  @Query(() => TransactionResponseDto)
  async getTransaction(
    @Args('transactionExternalId') transactionExternalId: string
  ): Promise<TransactionResponseDto> {
    return this.transactionService.getTransaction(transactionExternalId);
  }
}
