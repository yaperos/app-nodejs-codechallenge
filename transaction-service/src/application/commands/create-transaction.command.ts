export interface CreateTransactionCommand {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
  transactionExternalId?: string;
}
