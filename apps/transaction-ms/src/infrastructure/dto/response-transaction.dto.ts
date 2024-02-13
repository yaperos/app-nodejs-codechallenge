import {
  Transaction,
  TransactionType,
} from '../../domain/model/transaction.model';

interface transactionStatus {
  name: string;
}

export interface ResponseTransactionDto {
  transactionExternalId: string;
  transactionType: TransactionType;
  transactionStatus: transactionStatus;
  value: number;
  createdAt: Date;
}

export const getTransactionResponseDto = (
  transaction: Transaction,
  transactionType: TransactionType,
): ResponseTransactionDto => {
  return {
    transactionExternalId: transaction.id,
    transactionType: {
      name: transactionType.name,
    },
    transactionStatus: {
      name: transaction.status,
    },
    value: transaction.amount,
    createdAt: transaction.createdAt,
  };
};
