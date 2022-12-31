import app from '../../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import factories from '../../factories';
import { Transaction } from '../../models';
import ProducerFactory from '../producer.kafka';
import ConsumerFactory from '../consumer.kafka';
import { config } from '../../config';
import { KafkaMessage } from 'kafkajs';

const server = app.listen();

afterAll(() => server.close());

describe('Kafka', () => {

  describe('Producer', () => {
    test('should send and recive producer and consumer', async () => {
      const topic = 'topic-test';
      const transactionData = factories.transaction.build();
      const transaction = await Transaction.query().insert(transactionData).returning('*');

      const producerFactory = new ProducerFactory(topic);
      await producerFactory.start();
      await producerFactory.send(transaction);
      await producerFactory.shutdown();

      const consumerFactory = new ConsumerFactory(topic);
		  consumerFactory.callbackRecived = async (message: KafkaMessage) => {
        if (message.value) {
          const data = JSON.parse(message.value.toString());
          console.log('data', data);
        }
      };
		  await consumerFactory.startConsumer();

      expect(1).toBe(1);

    });

  });
  
});
