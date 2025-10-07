import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka!: Kafka;
  private producer!: Producer;
  private consumer!: Consumer;

  async onModuleInit() {
    this.kafka = new Kafka({
      clientId: 'transaction-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'transaction-group' });

    await this.producer.connect();
    await this.consumer.connect();
  }

  async send({ topic, messages }: { topic: string; messages: any[] }) {
    return this.producer.send({ topic, messages });
  }

  getConsumer(): Consumer {
    return this.consumer;
  }
}
