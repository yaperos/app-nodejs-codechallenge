export class ValidateTransactionDto  {
  id: number;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionExternalId : string;
  tranferTypeId: number;
  value: number;
};
