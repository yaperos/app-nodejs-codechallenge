export interface CreateTransactionRequestDto {
  transferTypeId: number;
  value: number;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;

  type: string;
  transactionId: string;
}
