import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entity/transaction.entity';
import { ParseUUIDPipe } from '@nestjs/common';
import { PaginationArgs, SearchArgs } from 'src/common/dto/arg';
import { UpdateTransactionArgs } from './dto/args/update-transaction.arg';
import { CreateTransactionArgs } from './dto/args/create-transaction.arg';
import { CreateTransactionInput } from './dto/inputs';

@Resolver()
export class TransactionResolver {

    constructor(
        private readonly transactionService: TransactionService,
    ){}

    @Mutation( () => Transaction, { name: "createTransaction"})
    async createTransaction(
        @Args('createTransactionInput') createTransactionInput: CreateTransactionInput
    ): Promise<Transaction> {
        
        const newTransaction = await this.transactionService.create( createTransactionInput )

        return newTransaction;
    }

    @Query(() => Transaction, { name: 'findTransaction' })
    async findOne(
        @Args('id', { type: () => ID }, ParseUUIDPipe ) id: string,
    ): Promise<Transaction> {
        return await this.transactionService.findOne( id );
    }

    @Query(() => [Transaction], { name: 'findAll' })
    async findAll(
        @Args() paginationArgs: PaginationArgs,
        @Args() searchArgs: SearchArgs,
    ):Promise<Transaction[]> {
        return await this.transactionService.findAll(paginationArgs, searchArgs);
    }

    @Mutation(() => Transaction, { name: 'update' })
    async updateList(
        @Args() updateTransactionArgs: UpdateTransactionArgs
    ) {
        return await this.transactionService.update(updateTransactionArgs.id, updateTransactionArgs.transactionStatus);
    }

}