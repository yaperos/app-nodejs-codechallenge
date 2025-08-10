import { Injectable } from '@nestjs/common';
import { TransactionCommand, TransactionCommandTypeEnum, TransactionStatusEnum } from '@shared/contracts';
import { Topics } from '@shared/messaging';
import { KafkaProducer } from '@shared/messaging/messaging-kafka';

@Injectable()
export class AntiFraudService {
  constructor(private readonly producer: KafkaProducer) {}

  async evaluateAndPublish(transactionExternalId: string, value: number): Promise<void> {
    const FRAUD_THRESHOLD = 1000;
    const status = value > FRAUD_THRESHOLD ? TransactionStatusEnum.REJECTED : TransactionStatusEnum.APPROVED;

    const transactionCommand: TransactionCommand = {
      status,
      externalId: transactionExternalId,
      type: TransactionCommandTypeEnum.VALIDATE_TRANSACTION,
    };

    await this.producer.publish(Topics.TransactionCommands, transactionExternalId, transactionCommand);
  }
}
