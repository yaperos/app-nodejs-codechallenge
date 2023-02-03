export class ShowTransactionDto {
  readonly transactionExternalId: string;
  readonly tranferTypeId: number;
  readonly transactionStatusId: number;
  readonly value: number;
  readonly createdAt: Date;
}
