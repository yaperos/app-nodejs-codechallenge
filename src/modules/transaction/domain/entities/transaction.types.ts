import { Transaction, TransactionStatus, TransactionType } from '@prisma/client';

export type TransactionWithRelations = Transaction & {
  transactionStatus: Pick<TransactionStatus, 'name'>;
  transactionType: Pick<TransactionType, 'name'>;
};
