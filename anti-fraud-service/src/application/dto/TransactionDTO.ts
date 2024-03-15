export class TransactionDTO {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  value: number;
  transactionStatusId: number;
  transactionTypeId: number;
  transactionExternalId: string;
  createdAt: string;
  updatedAt?: string;
}
