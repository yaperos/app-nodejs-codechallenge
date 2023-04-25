import { Controller, Post, Body, Logger } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class TransactionController {

    constructor(
        private readonly transactionService: TransactionService
    ){}

    @Post('create')
    saveTransaction(@Body() transaction:any){
        return this.transactionService.create(transaction);
    }

    @EventPattern('transaction.updated')
    getTransactionUpdated(@Payload() payload: any){
        Logger.log('Se actualizo',payload);
    }
}
