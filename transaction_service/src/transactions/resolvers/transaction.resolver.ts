import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TransactionService } from '../services/transaction.service';
import { TransactionType } from '../graphql/transaction.type';
import { CreateTransactionInput } from '../graphql/create-transaction.input';
import { TransactionResponseDto } from '../dto/create-transaction-response.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Resolver(() => TransactionType)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) { }

  @Query(() => TransactionType, { name: 'transaction' })
  async getTransaction(
    @Args('id') id: string
  ): Promise<TransactionResponseDto> {
    console.log(typeof id, id);
    return this.transactionService.findTransactionById(id);
  }

  @Mutation(() => TransactionType, { name: 'createTransaction' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<TransactionResponseDto> {

    return this.transactionService.createTransaction(input);
  }
}