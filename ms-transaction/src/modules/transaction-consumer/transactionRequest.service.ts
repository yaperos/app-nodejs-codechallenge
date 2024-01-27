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
      const { type } = message;
      switch (type) {
        case 'new_transaction':
          this.transactionService.processTransactionRequest(message);
          break;
        case 'transaction_retry':
          this.transactionService.processTransactionRetry(message);
          break;
        default:
          console.error(
            'Unknown transaction request message type',
            JSON.stringify({
              message,
            }),
          );
      }
    });
  }
}
