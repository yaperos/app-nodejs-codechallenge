export class Transaction {
  name: string;
}
export class TransactionResponseDto {
  transactionExternalId: string;
  transactionType: Transaction;
  transactionStatus: Transaction;
  value: number;
  createdAt: string;
}
