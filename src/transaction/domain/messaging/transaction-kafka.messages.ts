export type TransactionCreatedEventPayload = {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
  createdAt: string;
};

export type TransactionStatusUpdatedPayload = {
  transactionExternalId: string;
  status: 'approved' | 'rejected';
  reason?: string;
};
