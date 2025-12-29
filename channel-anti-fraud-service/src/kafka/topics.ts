export const TOPICS = {
  CREATED: 'transaction.created',
  STATUS_UPDATED: 'transaction.status-updated',
} as const;

export type TransactionCreatedEvent = {
  eventId: string;
  occurredAt: string;
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
};

export type TransactionStatusUpdatedEvent = {
  eventId: string;
  occurredAt: string;
  transactionExternalId: string;
  status: 'approved' | 'rejected';
};
