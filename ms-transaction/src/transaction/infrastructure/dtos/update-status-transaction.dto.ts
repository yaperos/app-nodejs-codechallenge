import { TransactionStatus } from '../../domain/enums/transaction-status.enum';

export class UpdateStatusTransactionDto {
  id: string;
  status: Exclude<TransactionStatus, TransactionStatus.PENDING>;
}
