import { TransactionStatus, TransactionType } from '../../entities';

export type CreateTransactionDto = {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
};
export type CreateTransactionResponseDto = {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  amount: number;
  id: number;
  createdAt: Date;
};

export type CreateTransactionEvent = Omit<CreateTransactionDto, 'value'> & {
  amount: number;
};

export enum TransactionPattern {
  CREATE_TRANSACTION = 'CREATE_TRANSACTION',
}

export type TransactionDataResponse = {
  transactionExternalId: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  value: number;
  createdAt: Date;
};

export type TransactionResponse = {
  message: string;
  status: TransactionResponseStatus;
  data: TransactionDataResponse | undefined;
};

export type TransactionResponseStatus = 'SUCCESS' | 'ERROR';
