import { Controller, Logger, Post } from '@nestjs/common';
import { Body, Get, Param, Put } from '@nestjs/common/decorators';
import { CreateTransactionDto, GetOneTransactionParam } from './dto/transactions.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {

    constructor(private readonly transactionService: TransactionsService) { }

    @Post('create')
    createTransaction(@Body() dto: CreateTransactionDto) {
        Logger.log(`🚥 APIGATEWAY-CONTROLLER: CALLING CREATING TRANSACTION SERVICE`)
        return this.transactionService.createTransaction(dto);
    }

    @Get('list')
    listTransaction() {
        Logger.log(`🚥 APIGATEWAY-CONTROLLER: CALLING LIST TRANSACTION SERVICE`)
        return this.transactionService.getTransactions();
    }

    @Get('get/:id')
    getTransactionById(@Param() param: GetOneTransactionParam) {
        Logger.log(`🚥 APIGATEWAY-CONTROLLER: CALLING LIST BY ID TRANSACTION SERVICE`)
        return this.transactionService.getTransactionById(param.id);
    }
}
