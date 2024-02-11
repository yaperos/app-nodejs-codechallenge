import { Injectable } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaService {
  private producer: Producer;

  constructor() {
    const kafka = new Kafka({
      clientId: 'client1',
      brokers: ['kafka:29092']
      
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
    const topic = 'yape.transactions';

    await this.producer.connect();

    const message: ProducerRecord = {
      topic,
      messages: [{ value: JSON.stringify(transactionData) }],
    };

    await this.producer.send(message);
  }

}
