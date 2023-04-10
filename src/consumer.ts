import { Kafka, logLevel } from 'kafkajs';
import sequelize from './config/sequelize';
import { Transaction } from './models/transaction.model';

import appConfig from './config/app';

console.log('appConfig.kafka.host => ', appConfig.kafka.host);

const kafka = new Kafka({
  clientId: 'qa-topic',
  brokers: [`${appConfig.kafka.host}:9092`],
  logLevel: logLevel.INFO,
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

const verifyTransaction = async (transactionId: number) => {
  const transaction = await Transaction.findOne({
    where: { id: transactionId },
  });

  if (transaction) {
    console.log('transaction consumer => ', transaction);

    transaction.status_id = transaction.value > 1000 ? 3 : 2;
    await transaction.save();
  }
};

const run = async () => {
  await sequelize.authenticate();
  //await sequelize.sync();
  console.log('connection database successfully');

  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }: any) => {
      console.log('consumerr => ', {
        partition,
        offset: message.offset,
        value: message?.value.toString(),
      });
      await verifyTransaction(message.value);
    },
  });
};

run().catch(console.error);
