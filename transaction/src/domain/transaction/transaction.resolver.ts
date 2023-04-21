import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entity/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { GetTransactionDto } from './dto/get-transaction.dto';

@Resolver(() => Transaction)
export class TransactionResolver implements OnModuleInit {
    constructor(
        private readonly transactionService: TransactionService,
        @Inject('ANTI_FRAUD_SERVICE')
        private readonly antiFraudClient: ClientKafka,
    ) { }

    @Mutation(() => Transaction, { name: 'createTransaction' })
    async create(@Args('createTransactionDto') createTransactionDto: CreateTransactionDto) {
        const transaction = await this.transactionService.create(createTransactionDto);

        this.transactionService.validate(transaction).subscribe(tranferStatusId => {
            const updateTransactionDto: UpdateTransactionDto = {
                id: transaction.id,
                tranferStatusId: Number(tranferStatusId),
            }
            this.transactionService.update(transaction.id, updateTransactionDto);
        });

        return transaction;
    }

    @Query(() => Transaction, { name: 'getTransaction' })
    findOne(@Args('getTransactionDto') getTransactionDto: GetTransactionDto) {
        return this.transactionService.findOne(getTransactionDto);
    }

    onModuleInit() {
        this.antiFraudClient.subscribeToResponseOf('transaction_created');
    }
}
