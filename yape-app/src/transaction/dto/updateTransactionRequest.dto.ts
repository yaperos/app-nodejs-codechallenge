import { TransactionStatus } from '../../entities';

export class UpdateTransactionRequest {
  transactionExternalId: string;
  transactionStatus: TransactionStatus;
}
