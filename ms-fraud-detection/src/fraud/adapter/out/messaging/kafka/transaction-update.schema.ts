import { TransactionStatus } from '../../../../../fraud/entity/transaction-status.enum';

export interface TransactionStatusUpdateSchema {
  transactionId: string;
  status: TransactionStatus;
}
