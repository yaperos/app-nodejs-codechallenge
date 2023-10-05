import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConfigService } from '../services/kafka-config.services';
import { GROUP_IDS, TOPICS } from '@src/core/constants/kafka.constant';
import {
  MAX_AMOUNT,
  TRANSACTION_STATUS,
} from '@src/core/constants/transaction.constant';

@Injectable()
export class KafkaMiddleware implements OnModuleInit {
  constructor(private kafkaConfigService: KafkaConfigService) {}

  private validationTransaction(data: { value: number; id: string }) {
    return !data.id && data.value > MAX_AMOUNT
      ? TRANSACTION_STATUS.REJECTED
      : TRANSACTION_STATUS.APPROVED;
  }

  private async sendTopic(value) {
    await this.kafkaConfigService.createProducer({
      topic: TOPICS.FRAUD_VALIDATION_RESPONSE,
      messages: [
        {
          value: JSON.stringify(value),
        },
      ],
    });
  }

  async onModuleInit() {
    const consumer = await this.kafkaConfigService.createConsumer(
      {
        groupId: GROUP_IDS.FRAUD_VALIDATION_GROUP,
      },
      { topics: [TOPICS.TRANSACTION_VALIDATION], fromBeginning: true },
    );
    await consumer.run({
      eachMessage: async ({ message }) => {
        const tranasction = JSON.parse(message.value.toString());
        const validation = this.validationTransaction(tranasction);
        await this.sendTopic({ ...tranasction, status: validation });
      },
    });
  }
}
