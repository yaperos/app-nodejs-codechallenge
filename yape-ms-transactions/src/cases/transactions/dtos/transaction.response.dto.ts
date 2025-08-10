export class TransactionTypeDto {
  name: string;
}

export class TransactionStatusDto {
  name: string;
}

export class TransactionResponseDto {
  transactionId: string;
  transactionType: TransactionTypeDto;
  transactionStatus: TransactionStatusDto;
  value: number;
  createdAt: string;
}
