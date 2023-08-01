import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @IsString()
  transactionExternalId: string;

  @IsNotEmpty()
  transactionStatus: TransactionStatus;
}

export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
