import 'dotenv/config';
import { Kafka } from 'kafkajs';
import logger from '../libs/logger';
import { TransactionMongoRepository } from '../repositories/transactionMongoRepository';

export const subscribeTransactionTopics = async () => {
  const KAFKA_GROUP = 'my-transaction-group';
  const topics = ['transaction-created', 'transaction-updated'];

  const repository = new TransactionMongoRepository();

  const kafka = new Kafka({
    clientId: 'my-demo-app',
    brokers: process.env.KAFKA_HOST.split(','),
  });

  logger.info('Kafka client created', { brokers: process.env.KAFKA_HOST });

  const consumer = kafka.consumer({ groupId: KAFKA_GROUP });
  await consumer.connect();
  await consumer.subscribe({ topics, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const transaction = JSON.parse(message.value.toString());
      try {
        logger.info('Processing message', { topic, partition, transaction });
        if (topic === 'transaction-created') {
          const mongoTransaction = await repository.create(transaction);
          logger.info('Transaction created on Mongo', { mongoTransaction });
        } else if (topic === 'transaction-updated') {
          await repository.update(transaction.id, transaction);
          logger.info('Transaction updated on Mongo', { transaction });
        }
      } catch (error) {
        logger.error('Error processing message', { topic, partition, transaction, error });
      }
      await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
    },
  });
};
