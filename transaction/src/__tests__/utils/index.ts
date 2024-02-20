import { faker } from '@faker-js/faker';
import { ITransactionRequest } from '../../application/transaction.interface';
import { TransactionModel } from '../../domain/transaction.model';

export const getMockRequest = () => ({
  accountExternalIdDebit: faker.string.uuid(),
  accountExternalIdCredit: faker.string.uuid(),
  transferTypeId: 1,
  value: 120,
});

export const getMockCreateTransaction = (request: ITransactionRequest) => {
  const transaction = new TransactionModel({
    accountExternalIdDebit: request.accountExternalIdDebit,
    accountExternalIdCredit: request.accountExternalIdCredit,
    transferTypeId: request.transferTypeId,
    value: request.value,
  });

  return {
    transactionExternalId: transaction.id,
    status: transaction.status,
    value: transaction.value,
  };
};

export const getMockTransaction = () => {
  const transaction = new TransactionModel({
    accountExternalIdDebit: faker.string.uuid(),
    accountExternalIdCredit: faker.string.uuid(),
    transferTypeId: 1,
    value: 120,
  });

  return {
    transactionExternalId: transaction.id,
    transactionType: {
      name: transaction.getTranferType(),
    },
    transactionStatus: {
      name: transaction.status,
    },
    value: transaction.value,
    createdAt: transaction.createdAt,
  };
};
