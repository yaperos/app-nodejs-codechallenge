import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '../entity/transaction.entity';
import { TransactionService } from '../services/transaction.service';

@Resolver((of) => Transaction)
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query((returns) => Transaction)
  getTransaction(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.findOneById(id);
  }

  @Query((returns) => [Transaction])
  transactions() {
    return this.transactionService.findAll();
  }

  @Mutation((returns) => Transaction)
  createTransaction(@Args('data') createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }
}
