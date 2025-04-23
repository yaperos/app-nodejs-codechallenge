import { KAFKA_TOPICS, TRANSACTION_STATUS_CODES } from '@app/shared';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(KAFKA_TOPICS.TRANSACTION_CREATED);

    await this.kafkaClient.connect();
  }

  async validateTransaction(transactionId: string, value: number) {
    const isValid = value <= 1000;
    const statusCode = isValid
      ? TRANSACTION_STATUS_CODES.APPROVED
      : TRANSACTION_STATUS_CODES.REJECTED;
    const reason = isValid
      ? 'Transaction approved'
      : 'Amount exceeds maximum allowed (1000)';

    const topic = isValid
      ? KAFKA_TOPICS.TRANSACTION_STATUS_APPROVED
      : KAFKA_TOPICS.TRANSACTION_STATUS_REJECTED;

    const message = {
      key: transactionId,
      value: {
        transactionId,
        statusCode,
        reason,
      },
    };

    await this.kafkaClient.emit(topic, message).toPromise();

    return { statusCode, reason };
  }
}
