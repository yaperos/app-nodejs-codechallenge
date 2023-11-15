import { TransactionStatus } from './transactionStatus';

export interface Event {
  transactionId: string;
  status: TransactionStatus;
}
