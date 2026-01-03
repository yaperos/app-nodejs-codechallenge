const { createTransaction, updateTransactionStatus, getTransactionById } = require('../../src/transactions/transaction.service');
const { PrismaClient } = require('@prisma/client');
const { sendTransactionEvent } = require('../../src/kafka/producer');

jest.mock('@prisma/client', () => {
  const mTransaction = { create: jest.fn(), update: jest.fn(), findUnique: jest.fn() };
  return { PrismaClient: jest.fn(() => ({ transaction: mTransaction })) };
});

jest.mock('../../src/kafka/producer', () => ({
  sendTransactionEvent: jest.fn()
}));

describe('Transaction Service', () => {
  let prisma;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  it('createTransaction should create transaction and send event', async () => {
    prisma.transaction.create.mockResolvedValue({
      id: 'uuid-1234',
      tranferTypeId: 1,
      value: 120,
      status: 'pending',
      createdAt: new Date()
    });

    const data = {
      accountExternalIdDebit: 'debit-uuid',
      accountExternalIdCredit: 'credit-uuid',
      tranferTypeId: 1,
      value: 120
    };

    const transaction = await createTransaction(data);

    expect(transaction.id).toBe('uuid-1234');
    expect(prisma.transaction.create).toHaveBeenCalled();
    expect(sendTransactionEvent).toHaveBeenCalledWith(transaction);
  });
});
