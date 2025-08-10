import { Injectable } from '@nestjs/common';
import { TransactionValidatedDto } from '@shared/contracts/events/transaction-validated';
import { Topics } from '@shared/messaging';
import { KafkaProducer } from '@shared/messaging/messaging-kafka';
import { TransactionStatusEnum } from 'apps/transactions-api/src/transactions/enums/transaction-status.enum';

@Injectable()
export class AntiFraudService {
  constructor(private readonly producer: KafkaProducer) {}

  async evaluateAndPublish(transactionExternalId: string, value: number): Promise<void> {
    const status = value > 1000 ? TransactionStatusEnum.REJECTED : TransactionStatusEnum.APPROVED;

    const eventPayload: TransactionValidatedDto = {
      transactionExternalId,
      transactionStatus: status,
    };

    await this.producer.publish(Topics.TransactionValidated, transactionExternalId, eventPayload);
  }
}
