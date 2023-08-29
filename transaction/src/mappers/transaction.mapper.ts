import { TransactionResponse } from 'src/common/transaction.type';
import { Transaction } from 'src/entities/transaction';

export const transactionMapper = (
  transaction: Transaction,
): TransactionResponse => {
  return {
    transactionExternalId: transaction.transactionExternalId,
    transactionType: {
      name: transaction.transferType.name,
    },
    transactionStatus: {
      name: transaction.status,
    },
    value: transaction.value,
    createdAt: transaction.createdAt,
  };
};
