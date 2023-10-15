export interface CreateBalanceTransactionRequestDto {
  accountBalanceId: string;
  transactionType: string;
  description: string;
  amount: number;
}
