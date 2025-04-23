export interface TransactionCreate {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  value: number;
  transferTypeId: number;
}
