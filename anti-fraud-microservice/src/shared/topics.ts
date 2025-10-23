export const TOPICS = {
  CREATE: 'transactions.create',
  APPROVED: 'transactions.approved',
  REJECTED: 'transactions.rejected',
};

export type ReviewedTransactionEvent = {
  transactionExternalId: string;
  status: 'APPROVED' | 'REJECTED';
  reviewedAt: string;
};