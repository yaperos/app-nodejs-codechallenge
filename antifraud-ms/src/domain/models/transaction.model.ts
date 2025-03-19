export interface TransactionModel {
    transactionExternalId: string;
    value: number;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transactionStatus: string; // PENDING, APPROVED, REJECTED
    createdAt: Date;
  }
  