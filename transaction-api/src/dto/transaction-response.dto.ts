export class TransactionResponseDto {
  transactionExternalId: number;
  transactionType: { name: string };
  transactionStatus: { name: string };
  value: number;
  createdAt: string;
}
