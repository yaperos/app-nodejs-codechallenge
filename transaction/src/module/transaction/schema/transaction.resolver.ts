import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from '../transaction.service';
import { TransactionRequest } from './transaction-request.input';
import { TransactionResponse } from './transaction-response.input';

@Resolver()
export class TransactionResolver {

    constructor(private readonly transactionService: TransactionService) { }

    @Query(() => TransactionResponse)
    async findById(@Args('id', { type: () => String }) id: string){
        return this.transactionService.findOneById(id);
    }

    @Mutation(() => TransactionResponse)
    async processTransaction(@Args('transactionInput') transactionInput: TransactionRequest) {
        return this.transactionService.initProcessTransaction(transactionInput);
    }
}