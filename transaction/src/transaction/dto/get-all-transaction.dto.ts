export class GetAllTransactionDto {
  transactionExternalId: string;

  accountExternalIdDebit: string;

  accountExternalIdCredit: string;

  tranferTypeId: number;

  status: string;

  value: number;
}
