export class TransactionResponseDto {
  transactionExternalId: string;
  transactionType: {
    name: number;
  };
  transactionStatus: {
    name: string;
  };
  value: number;
  createdAt: Date;
}
