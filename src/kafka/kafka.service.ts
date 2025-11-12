import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get('KAFKA_CLIENT_ID', 'wallet-transaction-service'),
      brokers: [this.configService.get('KAFKA_BROKER', 'localhost:9092')],
    });
  }

  async onModuleInit() {
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: this.configService.get('KAFKA_GROUP_ID', 'wallet-transaction-group'),
    });

    await this.producer.connect();
    await this.consumer.connect();
  }

  async onModuleDestroy() {
    await this.producer?.disconnect();
    await this.consumer?.disconnect();
  }

  async sendMessage(topic: string, message: any): Promise<void> {
    await this.producer.send({
      topic,
      messages: [
        {
          key: message.transactionExternalId,
          value: JSON.stringify(message),
        },
      ],
    });
  }

  async subscribeToTopic(
    topic: string,
    callback: (payload: EachMessagePayload) => Promise<void>
  ): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async payload => {
        try {
          await callback(payload);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      },
    });
  }
}
