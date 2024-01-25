import { TransactionStatusConsumerFactory } from '@yape-challenge/kafka';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { TransactionsService } from '../transactions/services/transactions.service';
import { ConfigEnv } from '../../config';

@Injectable()
export class TransactionStatusService implements OnModuleInit {
  constructor(private readonly transactionService: TransactionsService) {}

  onModuleInit() {
    const consumer = TransactionStatusConsumerFactory(ConfigEnv.serviceTag);
    consumer.subscribe((message) => {
      this.transactionService.processTransactionStatus(message);
    });
  }
}
