import { Injectable } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKER_1],
      
    });

    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  async sendTransactionToTopic(transactionData: any): Promise<void> {
    const topic = process.env.KAFKA_TRANSACTIONS_TOPIC;

    await this.producer.connect();

    const message: ProducerRecord = {
      topic,
      messages: [{ value: JSON.stringify(transactionData) }],
    };

    await this.producer.send(message);
  }

}
