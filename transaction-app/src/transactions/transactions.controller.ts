import { Controller, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { CreateTransactionRequest } from '../requests/create-transaction-request.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
@Controller()
export class TransactionsController implements OnModuleInit {
  private logger: Logger;

  constructor(private readonly transactionsService: TransactionsService, @Inject('ANTIFRAUD_SERVICE') private readonly antifraudClient: ClientKafka) {
    this.logger = new Logger(TransactionsService.name);

  }

  onModuleInit() {
    this.antifraudClient.subscribeToResponseOf('validate-transaction')
  }

  @EventPattern('transaction-created')
  handleTransactionCreateds(createTransactionRequest: CreateTransactionRequest) {

    this.transactionsService.handleTransactionCreated(createTransactionRequest)
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  handleCron() {
    try {
      this.transactionsService.updatePendingTransactions();
      this.logger.log('Updating pending transactions every 6 hours...');
    } catch (error) {
      this.logger.error('Error during Transaction', error);
    }
  }

}
