import { Query, Resolver } from '@nestjs/graphql';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from '../application/transaction.service';

@Resolver(() => { })
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) { }

  @Query(() => [Transaction], { name: 'transaction' })
  findAll() {
    return this.transactionService.findAll();
  }
}
