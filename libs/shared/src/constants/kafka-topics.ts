export const KAFKA_TOPICS = {
  // From Transaction Service to Anti-Fraud Service
  TRANSACTION_CREATED: 'transaction.created',

  // From Anti-Fraud Service to Transaction Service
  TRANSACTION_STATUS_APPROVED: 'transaction.status.approved',
  TRANSACTION_STATUS_REJECTED: 'transaction.status.rejected',
} as const;
