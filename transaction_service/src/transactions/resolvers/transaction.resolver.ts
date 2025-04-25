import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TransactionService } from '../services/transaction.service';
import { TransactionType } from './../graphql/gql-types/transaction.types';
import { CreateTransactionInput } from './../graphql/dto/create-transaction.dto';
import { ParseUUIDPipe, UsePipes, ValidationPipe, Logger, NotFoundException } from '@nestjs/common';
import { TransactionResponseDto } from './../../transactions/dto/create-transaction-response.dto';

@Resolver(() => TransactionType)
export class TransactionResolver {
  private readonly logger = new Logger(TransactionResolver.name);

  constructor(private readonly transactionService: TransactionService) { }

  @Query(() => TransactionType, { name: 'getTransaction', nullable: true })
  async getTransaction(

    @Args('transactionExternalId', { type: () => ID }, new ParseUUIDPipe({ version: '4' }))
    transactionExternalId: string,
  ): Promise<TransactionResponseDto | null> {
    this.logger.log(`GraphQL Query: getTransaction, ID: ${transactionExternalId}`);
    const cachedData = await this.transactionService.getTransactionFromCache(transactionExternalId);

    if (!cachedData) {
      this.logger.warn(`No se encontró la transacción en caché para ID: ${transactionExternalId}`);

      throw new NotFoundException(`Transacción no encontrada para ID: ${transactionExternalId}`);
    }
    return cachedData;
  }

  @Mutation(() => TransactionType, { name: 'createTransaction' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<TransactionResponseDto> {
    this.logger.log(`GraphQL Mutation: createTransaction, Input: ${JSON.stringify(input)}`);

    const createdTransactionEntity = await this.transactionService.createTransaction(input);

    return createdTransactionEntity;
  }
}