import { TTransactionStatus } from '../entities/transaction.entity';

export class CreateTransactionDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  correlationId: string;
  transferTypeId: number;
  value: number;
}

export class RetryTransactionDto {
  transactionId: string;
}

export class UpdateTransactionStatusDto {
  transactionId: string;
  status: TTransactionStatus;
}
