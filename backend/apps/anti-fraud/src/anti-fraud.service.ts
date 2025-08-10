import { Injectable } from '@nestjs/common';
import { TransactionStatusEnum , TransactionValidatedDto } from '@shared/contracts';
import { Topics } from '@shared/messaging';
import { KafkaProducer } from '@shared/messaging/messaging-kafka';

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
