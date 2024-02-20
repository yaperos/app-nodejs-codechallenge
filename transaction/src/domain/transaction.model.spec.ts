import { faker } from '@faker-js/faker';
import { TransactionModel, TransactionStatus } from './transaction.model';

describe('Create transaction model', () => {
  const mockRequest = {
    accountExternalIdDebit: faker.string.uuid(),
    accountExternalIdCredit: faker.string.uuid(),
    value: 120,
  };

  test('Should ensure that a created transaction has a default status of pending', () => {
    const transaction = new TransactionModel({
      ...mockRequest,
      transferTypeId: 1,
    });

    expect(transaction.status).toBe(TransactionStatus.pending);
  });

  test('Should ensure that transaction type is deposit', () => {
    const transaction = new TransactionModel({
      ...mockRequest,
      transferTypeId: 1,
    });

    expect(transaction.transferTypeId).toBe(1);
    expect(transaction.getTranferType()).toBe('deposit');
  });

  test('Should ensure that transaction type is withdraw', () => {
    const transaction = new TransactionModel({
      ...mockRequest,
      transferTypeId: 2,
    });

    expect(transaction.transferTypeId).toBe(2);
    expect(transaction.getTranferType()).toBe('withdraw');
  });
});
