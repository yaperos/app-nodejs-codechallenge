import { TransactionStatus } from '../transaction_status.enum';

export class AntifraudAnalysisResponsePayload {
  transactionId: string;
  version: number;
  newStatus: TransactionStatus;
}
