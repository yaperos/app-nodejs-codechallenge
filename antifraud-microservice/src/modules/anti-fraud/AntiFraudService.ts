import { Injectable } from '@nestjs/common';

import { EachMessagePayload, ProducerRecord } from 'kafkajs';
import { KafkaService } from '../kafka/infrastructure/KafkaService';
import { TRANSACTIONSTATUS } from './types';
import { PRODUCERS } from './events';

@Injectable()
export class AntiFraudService {
  constructor(private readonly kafkaService: KafkaService) {}

  async subscribeEvents(topics: string[]) {
    await this.kafkaService.consume(
      {
        topics,
      },
      { eachMessage: this.getResponseFromTransaction.bind(this) },
    );
  }

  private async evaluatedTransactionAntiFraudEvent(
    transaction: Record<string, any>,
  ) {
    try {
      const transactionCreatedRecord: ProducerRecord = {
        topic: PRODUCERS.TRANSACTION_WITH_FRAUD,
        messages: [
          {
            value: JSON.stringify({ transaction }),
          },
        ],
      };
      await this.kafkaService.produce(transactionCreatedRecord);
    } catch (error) {
      console.log(error);
    }
  }

  private async getResponseFromTransaction(payload: EachMessagePayload) {
    try {
      const evaluationResult = JSON.parse(payload.message.value.toString());
      evaluationResult.transaction.status =
        evaluationResult.transaction.value > 1000
          ? TRANSACTIONSTATUS.REJECTED
          : TRANSACTIONSTATUS.APPROVED;
      this.evaluatedTransactionAntiFraudEvent(evaluationResult);
    } catch (error) {
      console.log(error);
    }
  }
}
