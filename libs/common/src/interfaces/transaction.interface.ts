import { TransactionStatus } from '../enums';

export interface CreateTransactionDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
}

export interface TransactionCreatedEvent {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  createdAt: Date;
}

export interface TransactionValidatedEvent {
  transactionExternalId: string;
  status: TransactionStatus;
}

export interface TransactionResponse {
  transactionExternalId: string;
  transactionType: {
    name: string;
  };
  transactionStatus: {
    name: string;
  };
  value: number;
  createdAt: Date;
}
