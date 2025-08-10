export interface Transaction {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: string;
  transactionStatusName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
