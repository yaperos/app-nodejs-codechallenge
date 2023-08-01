import { Injectable } from '@nestjs/common';
import { KafkaClient } from 'src/infra/clients/kafka/kafka.client';
import { KafkaPayload } from 'src/infra/clients/kafka/types/kafka.type';
import { Logger } from 'nestjs-pino';

@Injectable()
export class KafkaFinancialTransactionProducerAdapter {
  constructor(private readonly kafkaClient: KafkaClient, private readonly logger: Logger) {}

  async sendMessage(data: any): Promise<void> {
    const topic = process.env.KAFKA_TOPIC_TO_TRANSACTION;

    const payload: KafkaPayload = {
      messageId: new Date().toISOString(),
      body: data,
      messageType: 'validated.anti.fraud',
      topicName: topic,
    };

    const value = await this.kafkaClient.send(topic, payload);
    this.logger.log('Data sent to evaluate', value);
  }
}
