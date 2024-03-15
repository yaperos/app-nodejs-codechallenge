import { FactoryProvider } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { config } from 'dotenv';

config();

export const KafkaConsumerClientFactory: FactoryProvider<Consumer> = {
  provide: 'KafkaConsumerClient',
  useFactory: () => {
    const consumer = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
      retry: {
        retries: +process.env.KAFKA_RETRIES,
      },
      ssl: false,
      connectionTimeout: +process.env.KAFKA_TIMEOUT,
    }).consumer({
      groupId: process.env.KAFKA_GROUP_ID,
    });

    consumer.connect().catch((error) => {
      throw new Error(`Kafka connection failed: ${error}`);
    });

    return consumer;
  },
  inject: [],
};
