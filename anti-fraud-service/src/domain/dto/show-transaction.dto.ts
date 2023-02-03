export class ShowTransactionDto {
  readonly transactionExternalId: string;
  readonly accountExternalIdDebit: string;
  readonly accountExternalIdCredit: string;
  readonly tranferTypeId: number;
  readonly value: number;
}
