import { ExternalTransactionStatus } from '../enums';

export interface TransactionStatusChanged {
  id: string;
  status: ExternalTransactionStatus;
}
