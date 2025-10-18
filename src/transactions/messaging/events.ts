export type TransactionCreatedEvent = {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
  createdAt: string;
};

export type TransactionStatusEvent = {
  transactionExternalId: string;
  status: "approved" | "rejected" | "pending";
  processedAt: string;
};
