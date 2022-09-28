import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { AppService } from '../../app.service';
import { IntegrationEvent, IntegrationEventPublisher } from '../../application/event/integration';
import { TOPIC_KAFKA_SEND_TRANSACTION } from '../constants';

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

  async publish(message: IntegrationEvent): Promise<void> {
    console.log('Transaction --Send transaction Created event--> Anti-Fraud', JSON.stringify(message));
    await this.producer.send({ topic: TOPIC_KAFKA_SEND_TRANSACTION, messages: [{ value: JSON.stringify(message) }] });
  }
}
