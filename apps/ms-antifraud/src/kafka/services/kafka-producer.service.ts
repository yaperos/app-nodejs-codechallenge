import { Injectable, Logger } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  private producer: Producer;
  private readonly logger = new Logger(KafkaProducerService.name);

  constructor() {
    const kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKER_1],
    });

    this.producer = kafka.producer();
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
    } catch (error) {
      this.logger.error(`Error connecting to Kafka producer: ${error.message}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
    } catch (error) {
      this.logger.error(`Error disconnecting from Kafka producer: ${error.message}`);
      throw error;
    }
  }

  async sendTransactionToTopic(transactionData: any): Promise<void> {
    try {
      const topic = process.env.KAFKA_TRANSACTIONS_TOPIC;

      await this.producer.connect();

      const message: ProducerRecord = {
        topic,
        messages: [{ value: JSON.stringify(transactionData) }],
      };

      await this.producer.send(message);
    } catch (error) {
      this.logger.error(`Error sending transaction to Kafka topic: ${error.message}`);
      throw error;
    }
  }
}
