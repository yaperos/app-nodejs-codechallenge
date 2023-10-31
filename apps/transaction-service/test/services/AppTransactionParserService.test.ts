import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Transaction, TransactionOutput } from '../../src/core/domain';
import { AppTransactionParserService } from '../../src/core/services';
import { transactionMock, transactionTypeMock } from '../test.mocks';

describe('App Transaction Parser Service', () => {
  const appTransactionParserService = new AppTransactionParserService();

  it('should parse a Transaction to TransactionOutput correctly', () => {
    const inputTransaction: Transaction = {
      ...transactionMock,
      status: 'APPROVED',
      transactionType: {
        id: 'transaction_type:2',
        name: 'InterBank',
      },
    };

    const expectedOutput: TransactionOutput = {
      createdAt: inputTransaction.createdAt,
      transactionExternalId: inputTransaction.externalId,
      transactionStatus: {
        name: 'APPROVED',
      },
      transactionType: {
        name: 'InterBank',
      },
      value: inputTransaction.value,
    };

    const result = appTransactionParserService.parse(inputTransaction);

    expect(result).toEqual(expectedOutput);
  });
});
