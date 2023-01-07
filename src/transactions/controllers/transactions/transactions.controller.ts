import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionRequest } from 'src/models/transaction.request';
import { TransactionResponse, TransactionStatus } from 'src/models/transaction.response';
import { TransactionsService } from 'src/transactions/services/transactions/transactions.service';
import { Transaction } from 'src/typeorm/transaction.entity';

@Controller('transactions')
export class TransactionsController {

    constructor(
        private readonly transactionsService: TransactionsService,
        @Inject('challenger-client')
        private readonly cliente: ClientProxy
    ) { }

    //Creates a new transaction and sends it to pending topic
    @Post()
    public async newTransaction(
        @Body() transaction: TransactionRequest
    ) {
        transaction = TransactionRequest.fromRaw(transaction);
        let newTransac = transaction.toTransaction();
        let result = await this.transactionsService.createTransaction(newTransac);
        let response = TransactionResponse.fromTransaction(result)
        this.cliente.emit('transaction.pending', JSON.stringify(response));
        return response;
    }

    //lists all transactions in the system
    @Get()
    public async allTransactions() {
        return this.transactionsService.getAll();
    }

     //Awaits for approved transactions and updates the information
    @MessagePattern('transaction.approved')
    public async transactionApproved(@Payload() payload: any) {
        let transac = TransactionResponse.fromRaw(payload).toTransaction();

        Logger.log(JSON.stringify(transac), TransactionsController.name);

        let upTransac = await this.transactionsService.approve(transac);
        return TransactionResponse.fromTransaction(upTransac);
    }

    //Awaits for rejected transactions and updates the information
    @MessagePattern('transaction.rejected')
    public async transactionRejected(@Payload() payload: any) {
        let transac = TransactionResponse.fromRaw(payload).toTransaction();

        Logger.log(JSON.stringify(transac), TransactionsController.name);

        let upTransac = await this.transactionsService.reject(transac);
        return TransactionResponse.fromTransaction(upTransac);
    }

}
