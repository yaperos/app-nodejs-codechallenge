import { TransactionStatus } from 'src/domain/models/transaction_status.enum';

export class AntifraudAnalysisResponsePayload {
  transactionId: number;
  version: number;
  newStatus: TransactionStatus;
}
