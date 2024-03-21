import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Transaction } from '../../models';
import { CreateTransactionInput, GetTransactionInput } from '../inputs';
import { TransactionsService } from '../services/transactions.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TRANSACTION_VALIDATED } from '../../constants';

@Resolver()
export class TransactionsResolver {
    constructor(
        private readonly transactionsService: TransactionsService
    ) { }

    @Query(() => Transaction)
    async transaction(@Args('input') input: GetTransactionInput): Promise<Transaction> {
      return await this.transactionsService.getTransactionByID(input.id);
    }

    @Query(() => [Transaction])   
    async transactions(): Promise<Transaction[]> {
        return await this.transactionsService.getTransactions();
    }
  
    @Mutation(() => Transaction)
    async createTransaction(@Args('input') input: CreateTransactionInput): Promise<Transaction> {
        return await this.transactionsService.createTransaction(input) 
    }
    
}
