import app from '../../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import factories from '../../factories';
import { Transaction } from '../../models';

const server = app.listen();

afterAll(() => server.close());

describe('TransactionController', () => {

  describe('Get', () => {
    test('should get a transaction correctly', async () => {
      const transactionData = factories.transaction.build();
      const transaction = await Transaction.query().insert(transactionData).returning('*');
      const response = await request(server).get(`/transactions/${transaction.transactionExternalId}`);
      expect(response.status).toBe(StatusCodes.OK);
      const keys = [
        "transactionExternalId",
        "transactionType",
        "transactionStatus",
        "value",
        "createdAt"
      ]
      Object.keys(response.body).map((value, index) => {
        expect(value).toBe(keys[index]);
      });
    });

    test("should return 404 if transaction doesn't exists", async () => {
      const response = await request(server).get(`/transactions/9999`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('Create', () => {
    test('should create a new transaction correctly', async () => {
      const transaction = factories.transaction.build();
      const response = await request(server).post(`/transactions`).send(transaction);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.id).toBe(transaction.id);
    });

    test('should fail to validate transaction empty data', async () => {
      const response = await request(server).post(`/transactions`).send({});
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
  
});
