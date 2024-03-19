import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Transaction } from './entity/transaction.entity';
import { CreateTransaction } from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Resolver()
export class TransactionsResolver {
    constructor(
        @Inject('KAFKA')
        private readonly kafka: ClientProxy,
        private readonly transactionService: TransactionsService
        ) {}
    @Query(() => Transaction)
    transaction(@Args('id') id: number): Promise<Transaction> {
        return this.transactionService.findById(id);
    }

    @Mutation(() => Transaction)
    async createTransaction(@Args('createTransaction') createTransaction: CreateTransaction) {
        const newTransaction = await this.transactionService.create(createTransaction);
        this.sendVerification(newTransaction.transactionExternalId, newTransaction.value);
        return newTransaction;
    }

    public sendVerification(id: number, value: number) {
        return this.kafka.emit('transaction-verification-send',JSON.stringify({
            id: id,
            value: value
        }));
    }
}
