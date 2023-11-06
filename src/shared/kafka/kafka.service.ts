import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { LoggerService } from '@shared/logger/logger.service';
import { API_NAME } from '@config/app';

@Injectable()
export class KafkaService extends LoggerService {
  constructor(@Inject(API_NAME) private readonly client: ClientKafka) {
    super(KafkaService.name);
  }

  async sendTransactionToFraudValidationTopic(
    topicName: string,
    transactionData: any,
  ): Promise<void> {
    try {
      const payload = { ...transactionData };

      this.logger.log(
        `-->  Sending Transaction to Fraud Validation on Topic: ${topicName} `,
        JSON.stringify(payload),
      );

      this.client.emit(topicName, {
        value: payload,
      });
    } catch (error) {
      this.logger.error(
        `-X-> Error Sending Transaction to Fraud Validation on Topic: ${topicName} `,
        error.message,
      );
    }
  }
}
