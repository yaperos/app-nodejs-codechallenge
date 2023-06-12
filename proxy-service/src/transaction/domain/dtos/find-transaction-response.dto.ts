interface TransactionStatusDto {
  name: string;
}

interface TransactionTypeDto {
  name: string;
}

export interface FindTransactionResponseDto {
  transactionExternalId: string;
  transactionType: TransactionTypeDto;
  transactionStatus: TransactionStatusDto;
  value: number;
  createdAt: Date;
}
