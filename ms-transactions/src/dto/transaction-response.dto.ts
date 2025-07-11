import {
  TransactionType,
  TransactionStatus,
} from '../domain/enums/transaction.enums';

export class TransactionResponseDto {
  transactionExternalId: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  value: number;
  createdAt: Date;
}
