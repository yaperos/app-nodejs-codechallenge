import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionCreator } from '@transactions/application/transaction.creator';
import { TransactionFinder } from '@transactions/application/transaction.finder';
import { TransactionRequestDto } from '@transactions/infrastructure/dtos/transaction-request.dto';
import { TransactionResponseDto } from '@transactions/infrastructure/dtos/transaction-response.dto';
import { toResponse } from '@transactions/infrastructure/transaction.mapper';

@Resolver()
export class TransactionsResolver {
  constructor(
    private readonly transactionCreator: TransactionCreator,
    private readonly transactionFinder: TransactionFinder,
  ) {}

  @Query(() => TransactionResponseDto)
  public async getTransaction(
    @Args('id') id: string,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionFinder.run(id);

    return toResponse(transaction);
  }

  @Mutation(() => TransactionResponseDto)
  public async createTransaction(
    @Args('transactionRequest') transactionRequest: TransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionCreator.run(transactionRequest);

    return toResponse(transaction);
  }
}
