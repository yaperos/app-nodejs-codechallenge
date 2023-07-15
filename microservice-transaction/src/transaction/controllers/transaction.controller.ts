import { Controller, Post, Body, Logger, Get } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateTransaction } from '../structure/interfaces/CreateTransaction';

@Controller()
export class TransactionController {

    constructor(
        private readonly transactionService: TransactionService
    ){}

    @Post('create')
    saveTransaction(@Body() transaction:CreateTransaction){
        return this.transactionService.create(transaction);
    }

    @Get('paginate')
    getAllTransactions() {
        return this.transactionService.findAll();
    }

    @EventPattern('transaction-updated')
    getTransactionUpdated(@Payload() payload: any){
        return this.transactionService.getTransactionUpdated(payload)
    }
}
