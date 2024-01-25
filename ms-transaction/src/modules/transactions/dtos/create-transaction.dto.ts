import { TransactionStatus } from '../entities/transaction.entity';

export class CreateTransactionDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  correlationId: string;
  transferTypeId: number;
  value: number;
}

export class UpdateTransactionStatusDto {
  transactionId: string;
  status: TransactionStatus;
}
