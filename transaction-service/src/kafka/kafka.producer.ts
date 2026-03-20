import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaProducer implements OnModuleInit, OnModuleDestroy {
  private kakfa = new Kafka({
    clientId: 'transaction-service',
    brokers: ['localhost:9092'],
  });

  private producer = this.kakfa.producer();

  async onModuleInit() {
    await this.producer.connect();
    console.log('Kafka producer connected');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async emit(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }
}
