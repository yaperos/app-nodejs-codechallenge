import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { AppService } from './app.service';
import { TransactionKafkaService } from './modules/transaction/infrastructure/services/transaction-kafka.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly http: HttpService,
    private readonly transactionKafkaService: TransactionKafkaService,
  ) {}

  updateStatus(transactionId: string, status: string) {
    console.log('UPDATE STATUS', AppService.kafka_topic_status, {
      key: transactionId,
      value: { transactionId, status },
    });
    this.transactionKafkaService.sentStatus(transactionId, status);
  }
}
