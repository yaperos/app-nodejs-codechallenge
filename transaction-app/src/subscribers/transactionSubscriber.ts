import 'dotenv/config';
import { Kafka } from 'kafkajs';
import logger from '../libs/logger';
import { TransactionMongoRepository } from '../repositories/transactionMongoRepository';

const KAFKA_GROUP = 'my-transaction-group';

const kafka = new Kafka({
  clientId: 'my-demo-app',
  brokers: [process.env.KAFKA_HOST],
});

// const getTransactionStatus = (transaction: any) => {
//   if (transaction.statusId === 2) return { name: 'APPROVED' };
//   else if (transaction.statusId === 3) return { name: 'REJECTED' };
//   return { name: 'PENDING' };
// };

const repository = new TransactionMongoRepository();

// const createTransactionOnMongo = async (transaction) => {
//   const transactionModel = new TransactionModel({
//     id: transaction.id,
//     transactionExternalId: transaction.accountExternalIdDebit || transaction.accountExternalIdCredit,
//     transactionType: {
//       name: transaction.accountExternalIdDebit ? 'DEBIT' : 'CREDIT',
//     },
//     transactionStatus: getTransactionStatus(transaction),
//     value: transaction.value,
//   });
//   await transactionModel.save();

//   logger.info('Transaction created on Mongo', { transaction });
// };

// const updateTransactionOnMongo = async (transaction) => {
//   logger.info(`Updating transaction ${transaction.id} on Mongo`);
//   const transactionModel = await TransactionModel.findOne({
//     id: transaction.id,
//   });
//   transactionModel.transactionStatus = getTransactionStatus(transaction);
//   await transactionModel.save();
//   logger.info('Transaction updated on Mongo', { transactionModel });
// };

const consumer = kafka.consumer({
  groupId: KAFKA_GROUP,
});

export const subscribeTransactionTopics = async () => {
  const topics = ['transaction-created', 'transaction-updated'];
  await consumer.connect();
  await Promise.all(topics.map((topic) => consumer.subscribe({ topic, fromBeginning: true })));
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
