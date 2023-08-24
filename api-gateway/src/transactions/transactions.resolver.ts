import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionResponse, CreateTransactionRequest } from './transactions.entity';
import { TransactionsService } from './transactions.service';

@Resolver()
export class TransactionsResolver {
    constructor(private readonly transactionService: TransactionsService) {}

    @Query(() => [TransactionResponse])
    getTransactions() {
        return this.transactionService.getTransactions();
    }

    @Mutation(() =>  TransactionResponse)
    createTransaction(@Args() params: CreateTransactionRequest) {
        return this.transactionService.createTransaction(params);
    }
}
