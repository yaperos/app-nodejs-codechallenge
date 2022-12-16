import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from 'src/adapter/input/messaging/kafka.service';
import { TransactionService } from '../../adapter/out/db/transaction.service';
import { Transaction } from '../models/transaction.interface';
import { AntifraudCheckPayload } from './antifraud_check.payload';

@Injectable()
export class TransactionCreationUsecase {
  constructor(
    private readonly configService: ConfigService,
    private transactionService: TransactionService,
    private readonly kafkaService: KafkaService,
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

    // TODO: check result

    // Notify Antifraud to check the transaction.
    const payload: AntifraudCheckPayload = {
      transactionId: created.transactionExternalId,
    };

    console.log(
      `TransactionCreationUsecase: before sending to Antifraud:  ${JSON.stringify(
        payload,
      )}`,
    );

    const topic = this.configService.get(
      'application.transport.event-driven.kafka.topics.antifraud-check',
    );

    await this.kafkaService.send(
      this.kafkaService.getProducer(),
      topic,
      payload,
    );

    return transaction;
  }
}
