export interface TransactionCreatedEvent {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
  createdAt: Date;
}

export interface TransactionStatusChangedEvent {
  transactionExternalId: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string | null;
  evaluatedAt: Date;
}
