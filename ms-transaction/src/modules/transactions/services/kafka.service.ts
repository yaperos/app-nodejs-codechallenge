import { Injectable, OnModuleInit } from '@nestjs/common';
import { TransactionRequestConsumerFactory } from '@yape-challenge/kafka';
import { ConfigEnv } from 'src/config';
import { TransactionsService } from './transactions.service';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(private readonly transactionService: TransactionsService) {}

  onModuleInit() {
    const consumer = TransactionRequestConsumerFactory(ConfigEnv.serviceTag);
    consumer.subscribe((message) => {
      this.transactionService.processTransactionRequest(message);
    });
  }
}
