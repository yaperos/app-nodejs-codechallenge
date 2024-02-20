import { faker } from '@faker-js/faker';
import { TransactionStatus, TransactionValidationModel } from './transaction-validation';

describe('Transaction Validation', () => {
  const mockTransaction = {
    id: faker.string.uuid(),
    transferTypeId: 1,
    status: TransactionStatus.pending,
    accountExternalIdDebit: faker.string.uuid(),
    accountExternalIdCredit: faker.string.uuid(),
    createdAt: new Date(),
  };

  test('Should update transaction status to approved if value is less than or equal to 1000', () => {
    const transaction = new TransactionValidationModel({
      ...mockTransaction,
      value: 980,
    });

    expect(transaction.status).toBe(TransactionStatus.pending);
    transaction.setTransactionStatusByAmount();
    expect(transaction.value).toBeLessThanOrEqual(1000);
    expect(transaction.status).toBe(TransactionStatus.approved);
  });

  test('Should update transaction status to rejected if value is greater than to 1000', () => {
    const transaction = new TransactionValidationModel({
      ...mockTransaction,
      value: 1001,
    });

    expect(transaction.status).toBe(TransactionStatus.pending);
    transaction.setTransactionStatusByAmount();
    expect(transaction.value).toBeGreaterThan(1000);
    expect(transaction.status).toBe(TransactionStatus.rejected);
  });
});
