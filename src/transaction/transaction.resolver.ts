import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';

@Resolver(() => Transaction)
export class TransactionResolver {
    constructor(private readonly transactionService: TransactionService) { }

    @Query(() => Transaction)
    async getTransactionById(@Args('id') id: string): Promise<Transaction> {
        return this.transactionService.getTransactionById(id);
    }

    @Mutation(() => Transaction)
    async createTransaction(@Args('createTransactionInput') createTransactionInput: CreateTransactionInput) {
        return this.transactionService.create(createTransactionInput);
    }
    
}



