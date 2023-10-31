import { vi } from 'vitest';

import { Transaction, TransactionType } from '../src/core/domain';

export const transactionRepositoryMock = {
  get: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
};

export const transactionTypeRepositoryMock = {
  getById: vi.fn(),
};

export const eventEmitterMock = {
  sendCreatedTransactionEvent: vi.fn(),
};

export const transactionTypeMock: TransactionType = {
  id: 'transaction_type:1',
  name: 'Bank',
};

export const transactionMock: Transaction = {
  accountExternalIdCredit: '0e153aae-bf3c-4293-9bdb-f117102e58b1',
  accountExternalIdDebit: '0e153aae-bf3c-4293-9bdb-f117102e58b1',
  createdAt: new Date(),
  externalId: 'b62d5dbf11074e8d8781998cdd2879ee',
  id: 'transaction:9j0voav9zlfhf8673slt',
  status: 'PENDING',
  transactionType: transactionTypeMock,
  updatedAt: new Date(),
  value: 1000,
};
