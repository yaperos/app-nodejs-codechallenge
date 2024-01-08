import { TransactionStatus } from '../constants/transaction-status.enum';

export class UpdateTransactionDto {
  status: TransactionStatus;
}
