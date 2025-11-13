import { createPendingTransaction, toTransactionCreatedEvent, toTransactionView } from './transaction';

describe('Transaction domain helpers', () => {
  it('creates pending transaction with provided props', () => {
    const now = new Date('2025-01-01T00:00:00Z');
    const transaction = createPendingTransaction({
      transactionExternalId: 'abc',
      accountExternalIdDebit: 'debit-1',
      accountExternalIdCredit: 'credit-1',
      transferTypeId: 2,
      value: 150,
      createdAt: now,
    });

    expect(transaction).toEqual({
      transactionExternalId: 'abc',
      accountExternalIdDebit: 'debit-1',
      accountExternalIdCredit: 'credit-1',
      transferTypeId: 2,
      value: 150,
      createdAt: now,
      status: 'pending',
    });
  });

  it('maps transaction to view DTO structure', () => {
    const transaction = createPendingTransaction({
      transactionExternalId: 'abc',
      accountExternalIdDebit: 'debit-1',
      accountExternalIdCredit: 'credit-1',
      transferTypeId: 3,
      value: 500,
      createdAt: new Date('2025-01-01T00:00:00Z'),
    });

    const view = toTransactionView(transaction);
    expect(view).toEqual({
      transactionExternalId: 'abc',
      transactionType: { name: 'transferTypeId:3' },
      transactionStatus: { name: 'pending' },
      value: 500,
      createdAt: transaction.createdAt,
    });
  });

  it('maps transaction to created event', () => {
    const transaction = createPendingTransaction({
      transactionExternalId: 'abc',
      accountExternalIdDebit: 'debit-1',
      accountExternalIdCredit: 'credit-1',
      transferTypeId: 5,
      value: 300,
      createdAt: new Date('2025-01-01T00:00:00Z'),
    });

    const event = toTransactionCreatedEvent(transaction);
    expect(event).toEqual({
      transactionExternalId: 'abc',
      accountExternalIdDebit: 'debit-1',
      accountExternalIdCredit: 'credit-1',
      transferTypeId: 5,
      value: 300,
      createdAt: transaction.createdAt,
    });
  });
});
