import { Injectable } from '@nestjs/common';

import { TransactionService } from '../../adapter/out/db/transaction.service';
import { Transaction } from '../models/transaction.interface';
import { AntifraudCheckPayload } from './antifraud_check.payload';

import { KafkaService } from 'src/adapter/input/messaging/kafka.service';

@Injectable()
export class TransactionCreationUsecase {
  constructor(
    private transactionService: TransactionService,
    private readonly kafkaService: KafkaService
  ) {}

  async create(transaction: Transaction) {
    console.log(
      'TransactionCreationUsecase: Create a transaction: ' +
        JSON.stringify(transaction),
    );
    const created: Transaction = await this.transactionService.create(
      transaction,
    );

    console.log(
      'TransactionCreationUsecase: Created: ' + JSON.stringify(created),
    );

    console.log('TransactionCreationUsecase: before sending to Antifraud');

    // Notify Antifraud to check the transition.
    const payload: AntifraudCheckPayload = { transactionId: created.id };

    // TODO: topic as constant
    await this.kafkaService.send(
      this.kafkaService.getProducer(),
      'antifraud-check',
      payload,
    );

    return created;
  }
}
