import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnApplicationShutdown {
  private producer: Producer;

  constructor() {
    this.producer = new Kafka({
      clientId: 'antifraude_kafka',
      brokers: ['localhost:9092'],
    }).producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(topic: string, value: Record<string, any>) {
    const record: ProducerRecord = {
      topic,
      messages: [
        {
          value: JSON.stringify(value),
        },
      ],
    };

    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
