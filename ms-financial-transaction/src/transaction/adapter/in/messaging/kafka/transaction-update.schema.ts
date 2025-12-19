import { TransactionStatus } from '../../../../../transaction/entity/transaction-status.enum';

export interface TransactionStatusUpdateSchema {
  transactionId: string;
  status: TransactionStatus;
}
