export interface TransactionToUpdate {
  accountExternalIdCredit: string;
  accountExternalIdDebit: string;
  transactionStatus: number;
  transactionId: string;
  tranferTypeId: number;
  createdAt: string;
  value: number;
}

export interface PayloadData {
  transactionCreated: TransactionToUpdate;
}
