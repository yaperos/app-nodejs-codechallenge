import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Resolver()
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => [Transaction])
  async transactions() {
    return this.transactionService.findAll();
  }

  @Mutation(() => Transaction)
  createTransaction(
    @Args('transactionInput') transactionInput: CreateTransactionDto,
  ) {
    return this.transactionService.createTransactions(transactionInput);
  }

  @Query(() => Transaction)
  transaction(@Args('id') id: string) {
    return this.transactionService.findTransactionByUid(id);
  }
}
