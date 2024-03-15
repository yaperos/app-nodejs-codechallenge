import { FactoryProvider } from '@nestjs/common';
import { Kafka, Partitioners, Producer } from 'kafkajs';

export const KafkaProducerClientFactory: FactoryProvider<Producer> = {
  provide: 'KafkaProducerClient',
  useFactory: () => {
    const producer = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
      retry: {
        retries: +process.env.KAFKA_RETRIES,
      },
      ssl: false,
      connectionTimeout: +process.env.KAFKA_TIMEOUT,
    }).producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });

    producer.connect().catch((error) => {
      throw new Error(`Kafka connection failed: ${error}`);
    });

    return producer;
  },
  inject: [],
};
