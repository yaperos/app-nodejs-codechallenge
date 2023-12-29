import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: process.env.KAFKA_CLIENT_ID
          ? process.env.KAFKA_CLIENT_ID
          : 'transaction-ms-client',
        brokers: [
          process.env.KAFKA_SERVER
            ? process.env.KAFKA_SERVER
            : 'localhost:9092',
        ],
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID
          ? process.env.KAFKA_GROUP_ID
          : 'yape-kafka-consumers',
      },
    },
  })
  client: ClientKafka;

  async onModuleInit() {
    this.client.subscribeToResponseOf(
      process.env.KAFKA_TOPIC ? process.env.KAFKA_TOPIC : 'transactions-topic',
    );
    await this.client.connect();
  }

  sendMessage(message: string) {
    this.client.emit(
      process.env.KAFKA_TOPIC ? process.env.KAFKA_TOPIC : 'transactions-topic',
      message,
    );
  }

  onModuleDestroy() {
    this.client.close();
  }
}
