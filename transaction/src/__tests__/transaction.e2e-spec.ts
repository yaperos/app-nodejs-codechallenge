import express from 'express';
import request from 'supertest';
import TransactionControllers, { transactionService } from '../infrastructure/controllers/transaction.controllers';
import { getMockRequest, getMockCreateTransaction, getMockTransaction } from './utils';

jest.mock('../infrastructure/kafka/kafka.client.ts');
jest.mock('../application/transaction.service.ts');

const app = express();
app.use(express.json());
app.use('/api/v1/transactions', TransactionControllers);

describe('Create Transaction endpoint', () => {
  beforeAll(() => {
    jest.spyOn(transactionService, 'handleUpdateStatusEvent').mockImplementation(() => Promise.resolve());
  });

  test('Should create transaction successfully', async () => {
    const mockRequest = getMockRequest();
    const mockTransaction = getMockCreateTransaction(mockRequest);
    jest.spyOn(transactionService, 'createTransaction').mockImplementation(() => Promise.resolve(mockTransaction));

    const response = await request(app)
      .post('/api/v1/transactions/')
      .send(mockRequest)
      .set('Accept', 'application/json');
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockTransaction);
  });

  test('Should return 422 when request is invalid', async () => {
    const response = await request(app).post('/api/v1/transactions').send({}).set('Accept', 'application/json');
    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('error');
  });

  test('Should get transaction by transactionId successfully', async () => {
    const mockTransaction = getMockTransaction();
    jest.spyOn(transactionService, 'getTransaction').mockImplementation(() => Promise.resolve(mockTransaction));

    const response = await request(app).get(`/api/v1/transactions/${mockTransaction.transactionExternalId}`);
    expect(response.status).toBe(200);
    expect(response.body.transactionExternalId).toEqual(mockTransaction.transactionExternalId);
  });
});
