import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewTransactionDTO } from './DTO/NewTransactionDTO';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

@Resolver((of) => Transaction)
export class TransactionResolver {
    constructor(private transactionService: TransactionService) {}

    @Query((returns) => Transaction)
    getTransaction(@Args('id', { type: () => String }) id: string) {
      return this.transactionService.getT(id);
    }
  
  
    @Mutation((returns) => Transaction)
    createTransaction(@Args('data') createTransactionDto: NewTransactionDTO) {
      return this.transactionService.create(createTransactionDto);
    }
}
