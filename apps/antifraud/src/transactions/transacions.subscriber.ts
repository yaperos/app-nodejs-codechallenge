import { SubscribeTo } from 'nestjs-kafkajs';
import { Injectable, Logger } from '@nestjs/common';
import { TransactionCreated } from './events';
import { TransactionsService } from './transactions.service';

@Injectable()
export class TransactionsSubscriber {
  private readonly logger = new Logger(TransactionsSubscriber.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  @SubscribeTo('transaction.created')
  async handleTransactionCreated(event: TransactionCreated) {
    this.logger.debug('Handle Transaction Created:', event);
    await this.transactionsService.validateTransaction(event);
  }
}
