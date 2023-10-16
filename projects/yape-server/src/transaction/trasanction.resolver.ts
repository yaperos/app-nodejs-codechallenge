import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auths/guards/jwt-auth.guard';
import { TransactionService } from './transaction.service';
import { NewTransactionInput } from './inputs/new-transaction.input';
import { TransactionDto } from './dto/transaction.dto';
import { AuthenticatedAccount } from 'src/common/decorators';
import { TransactionEntity } from './entity/transaction.entity';
import { GetTransactionInput } from './inputs/get-transaction.input';
import { GetTransactionDto } from './dto/get-transaction.dto';

@Resolver()
export class TrasanctionResolver {
  constructor(private readonly _transactionService: TransactionService) {}

  @Mutation(() => [TransactionDto])
  @UseGuards(JwtAuthGuard)
  async getTransactions(
    @Args('input') input: GetTransactionInput,
  ): Promise<TransactionEntity[]> {
    return this._transactionService.getTransactions(input);
  }

  @Mutation(() => TransactionDto)
  @UseGuards(JwtAuthGuard)
  async newTransaction(
    @Args('input') input: NewTransactionInput,
    @AuthenticatedAccount() { userId },
  ): Promise<TransactionEntity> {
    return this._transactionService.newTransaction(input, userId);
  }
}
