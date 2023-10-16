import { TransactionStatus } from 'apps/transaction-service/src/database/entities/transaction-status.entity';
import { TransactionType } from 'apps/transaction-service/src/database/entities/transaction-type.entity';
import { Transaction } from 'apps/transaction-service/src/database/entities/transaction.entity';
import {
  TransactionRequestDto,
  TransactionResponse,
} from 'apps/transaction-service/src/modules/transaction/dto/transaction.dto';

export const mockTransactionRequest: TransactionRequestDto = {
  accountExternalIdDebit: '353de19a-e8b9-4ebe-9ece-dd7e0286198f',
  accountExternalIdCredit: '353de19a-e8b9-4ebe-9ece-dd7e0286198a',
  tranferTypeId: 2,
  value: 1001,
};

export const mockTransactionResponse: TransactionResponse = {
  transactionExternalId: 'b544d82b-f13b-4420-b43d-8a1fa33f77c4',
  transactionType: {
    name: 'TRANSACTION_TYPE_2',
  },
  transactionStatus: {
    name: 'PENDING',
  },
  value: 1001,
  createdAt: new Date('2023-10-16T04:02:40.743Z'),
};

export const mockTransactionExternalId = 'b544d82b-f13b-4420-b43d-8a1fa33f77c4';

export const mockTransaction: Transaction = {
  id: 1,
  transactionExternalId: 'b544d82b-f13b-4420-b43d-8a1fa33f77c4',
  accountExternalIdDebit: '353de19a-e8b9-4ebe-9ece-dd7e0286198f',
  accountExternalIdCredit: '353de19a-e8b9-4ebe-9ece-dd7e0286198a',
  transactionType: {
    id: 2,
    name: 'TRANSACTION_TYPE_2',
  },
  value: 1001,
  transactionStatus: {
    id: 1,
    name: 'PENDING',
  },
  createdAt: new Date('2023-10-16T04:02:40.743Z'),
};

export const mockTransactionType: TransactionType = {
  id: 2,
  name: 'TRANSACTION_TYPE_2',
};

export const mockTransactionStatus: TransactionStatus = {
  id: 1,
  name: 'PENDING',
};
