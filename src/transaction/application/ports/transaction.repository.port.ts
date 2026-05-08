import type { Prisma } from '@prisma/client';

export type TransactionRow = Prisma.TransactionGetPayload<{
  include: { transferType: true };
}>;

export abstract class TransactionRepositoryPort {
  abstract createWithOutbox(input: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
  }): Promise<{ transactionExternalId: string }>;

  abstract findByExternalId(
    transactionExternalId: string,
  ): Promise<TransactionRow | null>;

  abstract updateStatusIfPending(
    transactionExternalId: string,
    status: 'approved' | 'rejected',
  ): Promise<void>;
}

export const TRANSACTION_REPOSITORY = Symbol('TransactionRepositoryPort');
