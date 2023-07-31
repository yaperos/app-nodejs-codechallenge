import { Prisma } from '@prisma/client';

export class UpdateTransactionDto {
  transactionExternalId: string;
  transactionStatus: TransactionStatus;
}

type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
