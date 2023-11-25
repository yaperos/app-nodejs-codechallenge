import { KafkaOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { Partitioners } from 'kafkajs';

dotenv.config();

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    producer: { createPartitioner: Partitioners.LegacyPartitioner },
    subscribe: {
      fromBeginning: true,
    },
    client: {
      clientId: 'nestjs-kafka',
      brokers: [
        process.env.KAFKA_BROKER || process.env.DEFAULT_KAFKA_BROKER_URL,
      ],
      connectionTimeout:
        parseInt(process.env.KAFKA_CONNECTION_TIMEOUT, 10) || 5000,
      requestTimeout: parseInt(process.env.KAFKA_REQUEST_TIMEOUT, 10) || 6000,
      retry: {
        initialRetryTime:
          parseInt(process.env.KAFKA_RETRY_INITIAL_TIME, 10) || 1000,
        retries: parseInt(process.env.KAFKA_MAX_RETRIES, 10) || 10,
      },
    },
    consumer: {
      groupId: 'nest-group',
    },
  },
};
