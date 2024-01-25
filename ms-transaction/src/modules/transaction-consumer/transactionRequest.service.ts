import { TransactionRequestConsumerFactory } from '@yape-challenge/kafka';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { TransactionsService } from '../transactions/services/transactions.service';
import { ConfigEnv } from '../../config';

@Injectable()
export class TransactionRequestService implements OnModuleInit {
  constructor(private readonly transactionService: TransactionsService) {}

  onModuleInit() {
    const consumer = TransactionRequestConsumerFactory(ConfigEnv.serviceTag);
    consumer.subscribe((message) => {
      this.transactionService.processTransactionRequest(message);
    });
  }
}
