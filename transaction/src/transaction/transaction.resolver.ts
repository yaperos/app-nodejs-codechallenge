import { Post } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateTransactionDto } from './dto/transaction.dto';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';

@Resolver()
export class TransactionResolver {

    constructor( private transactionService: TransactionService ){}

    @Query( returns => [Transaction])
    transactions(){
        return this.transactionService.allTransaction()
    }

    @Mutation( returns => Transaction)
    create(@Args('transaction') transaction: CreateTransactionDto){
        return this.transactionService.newTransaction( transaction )
    }

}
