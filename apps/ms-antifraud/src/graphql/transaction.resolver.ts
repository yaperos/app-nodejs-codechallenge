import { Resolver, Query } from '@nestjs/graphql';
import { TransactionDto } from './transaction.dto';
import { TransactionService } from './transaction.service';

@Resolver(() => TransactionDto)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => [TransactionDto])
  async getAllTransactions(): Promise<TransactionDto[]> {
    return this.transactionService.getAllTransactions();
  }
}
