const request = require('supertest');
const express = require('express');
const { createTransactionHandler, getTransactionByIdHandler } = require('../../src/transactions/transaction.controller');

// Mock service
jest.mock('../../src/transactions/transaction.service', () => ({
  createTransaction: jest.fn((data) => Promise.resolve({
    id: 'uuid-1234',
    tranferTypeId: data.tranferTypeId,
    value: data.value,
    createdAt: new Date(),
    status: 'pending'
  })),
  getTransactionById: jest.fn((id) => {
    if (id === 'notfound') return null;
    return Promise.resolve({
      id,
      tranferTypeId: 1,
      value: 120,
      createdAt: new Date(),
      status: 'approved'
    });
  })
}));

const app = express();
app.use(express.json());
app.post('/transactions', createTransactionHandler);
app.get('/transactions/:id', getTransactionByIdHandler);

describe('Transaction Controller', () => {
  it('POST /transactions - success', async () => {
    const res = await request(app)
      .post('/transactions')
      .send({
        accountExternalIdDebit: 'debit-uuid',
        accountExternalIdCredit: 'credit-uuid',
        tranferTypeId: 1,
        value: 120
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      transactionExternalId: 'uuid-1234',
      transactionType: { name: "" },
      transactionStatus: { name: "" },
      value: 120,
      createdAt: expect.any(String)
    });
  });

  it('GET /transactions/:id - not found', async () => {
    const res = await request(app).get('/transactions/notfound');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Transaction not found' });
  });
});
