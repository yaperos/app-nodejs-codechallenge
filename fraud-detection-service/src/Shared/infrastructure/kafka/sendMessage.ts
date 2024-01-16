import { Kafka, Producer } from 'kafkajs';
import { Logger } from '../Logger';
import dotenv from 'dotenv';

dotenv.config();

export class KafkaProducerService {
  private logger: Logger;
  private kafka: Kafka;
  private producer: Producer;  

  constructor() {
    this.logger = new Logger();
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'transaction',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });
    this.producer = this.kafka.producer();
  }

  async sendToKafkaService(message: unknown, topic?: string, groupId?: string) {
    const topicToSend = process.env.KAFKA_TOPIC|| 'transactions';
    const groupIdToSend = groupId || process.env.KAFKA_GROUP_ID || 'transactions';

    const messageToSend = {
      message,
      topic: topicToSend,
      groupId: groupIdToSend,
    };

    try {
      this.logger.debug('Connecting to Kafka...');
      await this.producer.connect();
      this.logger.debug('Sending message to Kafka topic...');
      await this.producer.send({
        topic: topicToSend,
        messages: [
          { value: JSON.stringify(messageToSend) },
        ],
      });
      this.logger.debug('Message successfully sent to Kafka topic: ' + topicToSend);
    } catch (error) {
      this.logger.error('Error sending message to Kafka: ' + error);
    } finally {
      await this.producer.disconnect();
    }
  }
}


