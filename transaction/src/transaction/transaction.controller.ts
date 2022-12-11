import { Controller, Post, Body, OnModuleInit, Get, Headers, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionRequest } from 'src/transaction/model/request/transaction-request';
import { UpdateTransactionMessage } from './model/event/update-transaction-message';
import { GetTransactionHeader } from './model/header/get-transaction-header';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {

    private readonly logger = new Logger(TransactionController.name);

    constructor(private readonly transactionService: TransactionService) {}

    @Post()
    sendTransaction(@Body() transactionRequest: TransactionRequest) {
      try {
        return this.transactionService.saveTransaction(transactionRequest);
      } catch (errors) {
        this.logger.log(errors)
      }
    }

    @Get()
    async getTransactions(@Headers() getTransactionHeaders: GetTransactionHeader) {
      try {
        return this.transactionService.getTransactions(getTransactionHeaders);
      } catch (errors) {
        this.logger.log(errors)
      }
    }

    @MessagePattern('update-transaction')
    validAntiFraud(@Payload() updateTransactionMessage: UpdateTransactionMessage) {
      return this.transactionService.updateTransactionAndSaveInMongo(updateTransactionMessage);
    }
}
