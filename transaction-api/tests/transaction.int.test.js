/* eslint-disable no-undef */
const request = require('supertest');
const { Kafka } = require('kafkajs');
const Transaction = require('../src/models/Transaction');
const createApp = require('../index');
const { statusTypes } = require('../src/utils/transactionConstants');

const { KAFKA_CONSUMER_CLIENT_ID, KAFKA_TOPIC_ANTI_FRAUD_RESPONSE, KAFKA_BROKER } = process.env;

let app;
let newTransactionId;

function delay(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

beforeAll(async () => {
  app = await Promise.resolve(createApp());
  // time for consumer group join
  await delay(8000);
});

describe('TRANSACTION-API INTEGRATION TEST', () => {
  describe('Tests for when a new transaction is created', () => {
    it('then it should create a new transaction with PENDING status', async () => {
      const transactionData = {
        value: 100,
        accountExternalIdDebit: '6340a438-eb34-4a87-b45f-cb52190d8c07',
        accountExternalIdCredit: '6340a438-eb34-4a87-b45f-cb52190d8c07',
        transferTypeId: 1,
      };

      const response = await request(app).post('/api/transaction/').send(transactionData);

      expect(response.body.error).not.toBeDefined();
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();

      const savedTransaction = await Transaction.findByPk(response.body.id);
      newTransactionId = savedTransaction.id;

      expect(savedTransaction.status).toBe(statusTypes.PENDING);
      expect(savedTransaction.value).toEqual(transactionData.value.toString());
    });

    it('then it should update the status to APPROVED when anti-fraud sends the event', async () => {
      // this part would be innecessary, as it is an integration test, once antifraud is deployed.
      // For challenge purposes I left it here.
      const kafka = new Kafka({
        clientId: KAFKA_CONSUMER_CLIENT_ID,
        brokers: [KAFKA_BROKER],
      });
      const producer = kafka.producer();
      await producer.connect();
      const topic = KAFKA_TOPIC_ANTI_FRAUD_RESPONSE;

      const message = {
        id: newTransactionId,
        status: statusTypes.APPROVED,
      };
      await producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
          },
        ],
      });

      const savedTransaction = await Transaction.findByPk(newTransactionId);
      expect(savedTransaction.status).toBe(statusTypes.APPROVED);

      await producer.disconnect();
    });
  });

  describe('Tests for when a new transaction is consulted', () => {
    it('then it should return the created transaction detailsadw', async () => {
      const response = await request(app).get(`/api/transaction/${newTransactionId}`);

      expect(response.status).toBe(200);
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.transactionExternalId).toBeDefined();
      expect(response.body.transactionStatus.name).toBe(statusTypes.APPROVED);
      expect(response.body.transactionType.name).toBe('wire_transfer');
      expect(response.body.value).toBe('100');
    });
  });
});
