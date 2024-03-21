import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from '../shared/dto/create-transaction.dto';

@Resolver(of => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(returns => Transaction)
  async transaction(@Args('id') id: string): Promise<Transaction> {
    return this.transactionService.getTransactionById(id);
  }

  @Mutation(returns => Transaction)
  async createTransaction(@Args('input') input: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.createTransaction(input);
  }
}