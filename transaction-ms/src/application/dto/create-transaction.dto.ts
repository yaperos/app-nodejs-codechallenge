export interface CreateTransactionDTO {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
}