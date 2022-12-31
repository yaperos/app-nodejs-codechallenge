import app from '../../app';
import factories from '../../factories';
import { Transaction } from '../../models';
import ProducerFactory from '../producer.kafka';
import ConsumerFactory from '../consumer.kafka';
import { StatusInterface } from '../../Interfaces/transaction.interface'
import { antifraudResolveService } from '../../services/antifraud.resolve.services';
import { AntifraudInterface } from '../../Interfaces/antifraud.interface';

const server = app.listen();

afterAll(() => server.close());
const transactionData = factories.transaction.build();
const topic = 'topic-test-jest';

describe('Kafka', () => {

  describe('Producer', () => {
    test('should send data', async () => {
      
      const transaction = await Transaction.query().insert(transactionData).returning('*');
      const producerFactory = new ProducerFactory(topic);
      await producerFactory.start();
      await new Promise((r) => setTimeout(r, 5000));
      await producerFactory.send(transaction);
      await new Promise((r) => setTimeout(r, 5000));
      await producerFactory.shutdown();
      expect(producerFactory.sendResult[0].errorCode).toBe(0);

    });
  });

  describe('Consumer', () => {
    test('should recive data', async () => {

      let recived!: AntifraudInterface;
      const consumerFactory = new ConsumerFactory(topic);
		  consumerFactory.callbackRecived = async (data: AntifraudInterface) => {
        recived = data;
      };
		  await consumerFactory.startConsumer();
      await new Promise((r) => setTimeout(r, 20000));
      await consumerFactory.shutdown();
      expect(recived?.transactionExternalId).toBe(transactionData.transactionExternalId);

    }, 25000);
  });

  describe('Antifraud Resolve Service', () => {
    test('should validate the update data for value grate than 1000 "REJECTED"', async () => {

      const transactionFactory = factories.transaction.build({value: 1100});
      const transactionNew = await Transaction.query().insert(transactionFactory).returning('*');
      let message: AntifraudInterface = {
        status: transactionNew.value < 1000 ? StatusInterface.APPROVED : StatusInterface.REJECTED,
        transactionExternalId: transactionNew.transactionExternalId,
      }
      await antifraudResolveService(message);
      const transaction = await Transaction.query().where({transactionExternalId: message.transactionExternalId}).first();
      expect(transaction?.status).toBe(StatusInterface.REJECTED);

    });

    test('should validate the update data for value less than 1000 "APPROVED"', async () => {

      const transactionFactory = factories.transaction.build({value: 900});
      const transactionNew = await Transaction.query().insert(transactionFactory).returning('*');
      let message: AntifraudInterface = {
        status: transactionNew.value < 1000 ? StatusInterface.APPROVED : StatusInterface.REJECTED,
        transactionExternalId: transactionNew.transactionExternalId,
      }
      await antifraudResolveService(message);
      const transaction = await Transaction.query().where({transactionExternalId: message.transactionExternalId}).first();
      expect(transaction?.status).toBe(StatusInterface.APPROVED);

    });
  });
  
});
