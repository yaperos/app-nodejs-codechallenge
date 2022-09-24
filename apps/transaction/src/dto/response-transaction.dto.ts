import { Transaction } from '../entity/transaction.entity';

interface TransactionType {
  id?: number;
  name: string;
}

interface transactionStatus {
  name: string;
}

export class ResponseTransactionDto {
  'transactionExternalId': string;
  'transactionType': TransactionType;
  'transactionStatus': transactionStatus;
  'value': number;
  'createdAt': Date;
}

export const responseDto = (
  transaction: Transaction,
  transactionType: TransactionType,
) => {
  return {
    transactionExternalId: transaction.transactionExternalId,
    transactionType: {
      name: transactionType.name,
    },
    transactionStatus: {
      name: transaction.status,
    },
    value: transaction.value,
    createdAt: transaction.createdAt,
  };
};
