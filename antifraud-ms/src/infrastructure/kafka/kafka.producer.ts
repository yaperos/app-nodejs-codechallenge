import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducer implements OnModuleInit {
  private producer: Producer;

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'anti-fraud-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });
    this.producer = kafka.producer();
    await this.producer.connect();
  }

  async send(topic: string, message: any): Promise<void> {
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
