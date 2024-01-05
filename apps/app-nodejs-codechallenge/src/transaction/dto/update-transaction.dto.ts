export class UpdateTransactionDto {
  id?: number;
  transactionExternalId?: string;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  value?: number;
  transactionTypeId?: number;
  transactionStatusId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
