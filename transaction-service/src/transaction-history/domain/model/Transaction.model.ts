export class TransactionModel {
  readonly transactionExternalId?: string;
  readonly accountExternalIdDebit: string;
  readonly accountExternalIdCredit: string;
  readonly transactionTypeId: number;
  readonly transactionStatusId: number;
  readonly value: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
