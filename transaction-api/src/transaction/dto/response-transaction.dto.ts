export class ResponseTransactionDto {
  transactionExternalId: number;
  transactionType: { name: string };
  transactionStatus: { name: string };
  value: number;
  createdAt: string;
}
