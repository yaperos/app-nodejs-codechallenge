import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { AppService } from '../../app.service';
import { IntegrationEvent, IntegrationEventPublisher } from '../../application/event/integration';
import { TOPIC_KAFKA_RECIVE_STATUS_TRANSACTION } from '../constants';

@Injectable()
export class IntegrationEventPublisherImplement implements IntegrationEventPublisher {
  private kafka: Kafka;
  private producer: Producer;
  topic: string;

  constructor() {
    const config = AppService.KafkaConfig();
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
    });

    this.producer = this.kafka.producer();
    this.producer.connect();
  }

  async publish(payload: IntegrationEvent): Promise<void> {
    console.log(`Anti-Fraud -- Send transaction Status ${payload.data.transactionStatus} event--> Transaction`, JSON.stringify(payload));
    await this.producer.send({ topic: TOPIC_KAFKA_RECIVE_STATUS_TRANSACTION, messages: [{ value: JSON.stringify(payload) }] });
  }
}
