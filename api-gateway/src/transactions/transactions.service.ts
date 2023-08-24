import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateTransactionRequest } from './transactions.entity';

@Injectable()
export class TransactionsService implements OnModuleInit {
    constructor(
        @Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka
    ) { }

    onModuleInit() {
        this.transactionClient.subscribeToResponseOf('transaction_created');
        this.transactionClient.subscribeToResponseOf('get_transactions');
    }

    getTransactions() {
        return firstValueFrom(this.transactionClient.send('get_transactions', {}));
    }

    createTransaction(params: CreateTransactionRequest) {
        return firstValueFrom(this.transactionClient.send('transaction_created', JSON.stringify(params)));
    }
}
