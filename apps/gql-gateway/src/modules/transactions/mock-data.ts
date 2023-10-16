import { TransactionRequest, TransactionResponse } from './transaction.schema';

export const mockTransactionResponse: TransactionResponse = {
  transactionExternalId: 'b544d82b-f13b-4420-b43d-8a1fa33f77c4',
  transactionType: {
    name: 'TRANSACTION_TYPE_2',
  },
  transactionStatus: {
    name: 'PENDING',
  },
  value: 1001,
  createdAt: '2023-10-16T04:02:40.743Z',
};

export const mockTransactionRequest: TransactionRequest = {
  accountExternalIdDebit: '353de19a-e8b9-4ebe-9ece-dd7e0286198f',
  accountExternalIdCredit: '353de19a-e8b9-4ebe-9ece-dd7e0286198a',
  tranferTypeId: 2,
  value: 1001,
};
