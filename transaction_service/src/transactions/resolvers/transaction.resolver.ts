// src/transaction/resolvers/transaction.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TransactionService } from '../services/transaction.service';
import { TransactionType } from '../graphql/transaction.type';
import { CreateTransactionInput } from '../graphql/create-transaction.input';
import { TransactionResponseDto } from '../dto/create-transaction-response.dto';
import { ParseUUIDPipe, UsePipes, ValidationPipe } from '@nestjs/common';

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

  @Mutation(() => TransactionType, { name: 'createTransaction' }) // Defines a GraphQL mutation
  @UsePipes(new ValidationPipe({ transform: true })) // Apply validation
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<TransactionResponseDto> {
    // Note: DTO mapping happens automatically based on field names
    // if the service returns the DTO
    return this.transactionService.createTransaction(input);
  }
}