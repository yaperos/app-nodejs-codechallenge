import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKERS],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async sendMessage(topic: string, message: any): Promise<void> {
    const parsedMessage = JSON.stringify(message);
    await this.producer.connect();
    const producerRecord: ProducerRecord = {
      topic,
      messages: [{ value: parsedMessage }],
    };
    await this.producer.send(producerRecord);
  }
}
