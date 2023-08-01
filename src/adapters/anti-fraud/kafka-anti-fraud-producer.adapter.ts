import { Injectable } from '@nestjs/common';
import { KafkaClient } from 'src/infra/clients/kafka/kafka.client';
import { Logger } from 'nestjs-pino';
import { Ports, Entities } from 'src/domain/anti-fraud';

@Injectable()
export class KafkaAntiFraudProducerAdapter implements Ports.AntiFraudPort {
  constructor(private readonly kafkaClient: KafkaClient, private readonly logger: Logger) {}

  async returnTransactionEvaluated(data: Entities.KafkaPayload): Promise<void> {
    const topic = process.env.KAFKA_TOPIC_FROM_ANTI_FRAUD;

    data.topicName = topic;

    const value = await this.kafkaClient.send(topic, data);
    this.logger.log('Data sent to evaluate', value);
  }

  async returnErrorTransactionEvaluated(data: Entities.KafkaPayload): Promise<void> {
    const topic = process.env.KAFKA_TOPIC_ERROR_FROM_ANTI_FRAUD;

    data.topicName = topic;

    const value = await this.kafkaClient.send(topic, data);
    this.logger.log('Data sent to evaluate', value);
  }
}

export const kafkaAntiFraudProducerAdapterProvider = {
  provide: Ports.AntiFraudPort,
  useClass: KafkaAntiFraudProducerAdapter,
};
