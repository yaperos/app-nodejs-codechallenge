import { Inject } from '@nestjs/common';
import { InjectionToken } from 'src/modules/transaction/InjectionToken';
import {
  STATUS,
  TYPE,
  Transaction,
} from 'src/modules/transaction/domain/Transaction';
import { TransactionRepository } from 'src/modules/transaction/domain/TransactionRepository';

import { v4 } from 'uuid';
import { KafkaService } from 'src/modules/kafka/infrastructure/KafkaService';
import { EachMessagePayload, ProducerRecord } from 'kafkajs';
import { UpdateTransactionToAprovedRejected } from '../update/UpdateTransactionToAprovedRejected';
import { PRODUCERS } from '../../domain/events/types';
import { customValidation } from 'src/Shared/domain/utils/Validation';
export interface Request {
  value: number;
  transferTypeId: TYPE;
}

export class CreateTransaction {
  constructor(
    @Inject(InjectionToken.TRANSACTION_REPOSITORY)
    private readonly repository: TransactionRepository,
    private readonly updateTransactionToAprovedRejected: UpdateTransactionToAprovedRejected,
    private readonly kafkaService: KafkaService,
  ) {}
  async run({ value, transferTypeId }: Request): Promise<Transaction> {
    await customValidation({ value, transferTypeId });
    const payload = Transaction.create({
      status: STATUS.PENDING,
      value,
      transferTypeId,
    });
    const response = await this.repository.create(payload);
    this.createTransactionEvent(response);
    return response;
  }

  private createTransactionEvent(payload: Transaction) {
    this.sendTransactionCreatedEvent(Transaction.toPrimitives(payload));
  }

  async subscribeEvents(topics: string[]) {
    await this.kafkaService.consume(
      {
        topics,
      },
      { eachMessage: this.getResponseFromAntiFraudService.bind(this) },
    );
  }
  private async sendTransactionCreatedEvent(transaction: Record<string, any>) {
    try {
      const transactionCreatedRecord: ProducerRecord = {
        topic: PRODUCERS.TRANSACTION_CREATED,
        messages: [
          {
            value: JSON.stringify({ eventId: v4(), transaction }),
          },
        ],
      };
      await this.kafkaService.produce(transactionCreatedRecord);
    } catch (error) {
      console.log(error);
    }
  }

  private async getResponseFromAntiFraudService(payload: EachMessagePayload) {
    try {
      const evaluationResult = JSON.parse(payload.message.value.toString());
      await this.updateTransactionToAprovedRejected.run({
        transactionId: evaluationResult.transaction.transaction.id,
        status: evaluationResult.transaction.transaction.status,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
