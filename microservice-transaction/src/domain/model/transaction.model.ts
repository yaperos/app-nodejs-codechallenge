export class TransactionEntity {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
  transactionType?: string;
  transactionStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
