export interface TransactionResponse {
  transactionExternalId: string;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  value: number;
  createdAt: Date;
  transferType: { name: string };
  transactionStatus: { name: string };
}
