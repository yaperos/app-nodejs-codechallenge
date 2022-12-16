import { TransactionStatus } from 'src/domain/models/transaction_status.enum';

export class AntifraudAnalysisResponsePayload {
  transactionId: string;
  version: number;
  newStatus: TransactionStatus;
}
