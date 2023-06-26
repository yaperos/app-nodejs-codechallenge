import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entity/transaction.entity';
import { CreateTransactionInput, UpdateTransactionInput } from './dto/inputs';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { Logger, Inject, ParseUUIDPipe } from '@nestjs/common';
import { TransactionInput } from './dto/inputs/transaction.input';
import { TransactionStatus } from './enums/transaction-status.enum';
import { PaginationArgs, SearchArgs } from 'src/common/dto/arg';

@Resolver()
export class TransactionResolver {

    constructor(
        private readonly transactionService: TransactionService,
    ){}

    @Mutation( () => Transaction, { name: "CreateTransaction"})
    async createTransaction(
        @Args('createTransactionInput') createTransactionInput: CreateTransactionInput
    ): Promise<Transaction> {
        
        const newTransaction = await this.transactionService.create( createTransactionInput )

        return newTransaction;
    }

    @Query(() => Transaction, { name: 'transaction' })
    async findOne(
        @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    ): Promise<Transaction> {
        return this.transactionService.findOne( id );
    }

    @Query(() => [Transaction], { name: 'transactions' })
    async findAll(
        @Args() paginationArgs: PaginationArgs,
        @Args() searchArgs: SearchArgs,
    ):Promise<Transaction[]> {
        return this.transactionService.findAll(paginationArgs, searchArgs);
    }

    @Mutation(() => Transaction)
    updateList(
        @Args('updateTransactionInput') updateTransactionInput: UpdateTransactionInput
    ) {
        return this.transactionService.update(updateTransactionInput);
    }

}