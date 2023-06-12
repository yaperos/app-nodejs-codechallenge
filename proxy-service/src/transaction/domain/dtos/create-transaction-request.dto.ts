export interface CreateTransactionRequestDto {
  type: string;
  transactionId: string;
  transferTypeId: number;
  value: number;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
}
