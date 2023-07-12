import { Kafka, Partitioners, Producer } from 'kafkajs';
import logger from './logger';

let kafka: Kafka;
let producer: Producer;

if (!kafka) {
  kafka = new Kafka({
    clientId: 'my-kafka-app',
    brokers: process.env.KAFKA_HOST.split(','),
  });

  producer = kafka.producer({
    allowAutoTopicCreation: true,
    createPartitioner: Partitioners.LegacyPartitioner,
  });
}

export const kafkaProducer = {
  get: () => producer,
  connect: async () => {
    await producer.connect();
    logger.info('Kafka Producer connected');
  },
};
