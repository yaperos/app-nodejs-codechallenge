import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './entities/transaction.entity';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Resolver()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => TransactionResponseDto) // escritura
  async createTransaction(
    @Args('input') input: CreateTransactionInput
  ): Promise<TransactionResponseDto> {
    return this.transactionService.createTransaction(input);
  }

  @Query(() => TransactionResponseDto) // lectura
  async getTransaction(
    @Args('transactionExternalId') transactionExternalId: string
  ): Promise<TransactionResponseDto> {
    
    return this.transactionService.getTransaction(transactionExternalId);
  }
}
