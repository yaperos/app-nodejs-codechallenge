import { Controller, Post, Body } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';

@Controller()
export class TransactionController {

    constructor(
        private readonly transactionService: TransactionService
    ){}

    @Post('create')
    saveTransaction(@Body() transaction:any){
        return this.transactionService.create(transaction);
    }
}
