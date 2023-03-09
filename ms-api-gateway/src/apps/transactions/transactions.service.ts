import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/transactions.dto';

@Injectable()
export class TransactionsService implements OnModuleInit {

    constructor(
        @Inject('TRANSACTIONS_MICROSERVICE') private readonly transactionClient: ClientKafka
    ) { }

    createTransaction(dto: CreateTransactionDto) {
        Logger.log(`🔥 APIGATEWAY-SERVICE: CALLING CREATE TRANSACTION EVENT`)
        return this.transactionClient.send('transaction.create', JSON.stringify(dto))
    }

    getTransactions() {
        Logger.log(`🔥 APIGATEWAY-SERVICE: CALLING LIST TRANSACTION EVENT`)
        return this.transactionClient.send('transaction.list', JSON.stringify({}))
    }

    getTransactionById(id) {
        Logger.log(`🔥 APIGATEWAY-SERVICE: CALLING LIST BY ID TRANSACTION EVENT`)
        return this.transactionClient.send('transaction.list.one', JSON.stringify({ id }))
    }

    onModuleInit() {
        this.transactionClient.subscribeToResponseOf('transaction.create');
        this.transactionClient.subscribeToResponseOf('transaction.list');
        this.transactionClient.subscribeToResponseOf('transaction.list.one');
    }
}
