import { TransactionStatus } from '../enums/transaction-status';

export interface UpdateTransactionEventDto {
  type: string;
  transactionId: string;
  transactionStatus: TransactionStatus;
}
