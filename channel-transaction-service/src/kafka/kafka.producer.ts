import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaProducer implements OnModuleInit {
  private producer = new Kafka({
    clientId: 'transaction-service-producer',
    brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
  }).producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async send(topic: string, key: string, value: unknown) {
    await this.producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(value) }],
    });
  }
}