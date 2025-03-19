export class TransactionEntity {
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
    transactionStatus: string; // PENDING, APPROVED, REJECTED
    transactionType?: string; 
    createdAt: Date;
  }
  