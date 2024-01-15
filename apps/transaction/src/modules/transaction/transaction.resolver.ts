import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  TransactionResponseDto,
  TransactionSearchRequestDto,
  TransactionSearchResponseDto,
} from './dto/transaction.dto';
import { TransactionService } from './transaction.service';
import { TransactionRegisterDto } from '@app/common';

@Resolver()
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => [TransactionSearchResponseDto], {
    name: 'searchTransactions',
  })
  async searchTransactions(
    @Args('transactionSearchRequestDto')
    transactionSearchRequestDto: TransactionSearchRequestDto,
  ): Promise<TransactionSearchResponseDto[]> {
    return await this.transactionService.searchTransactions(
      transactionSearchRequestDto,
    );
  }

  @Mutation(() => TransactionResponseDto)
  async registerTransaction(
    @Args('transactionDto') transactionDto: TransactionRegisterDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.registerTransaction(transactionDto);
  }
}
