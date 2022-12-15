import { TransactionStatus } from '../models/transaction_status.enum';

export class AntifraudAnalysisResponsePayload {
  transactionId: number;
  version: number;
  newStatus: TransactionStatus;
}
