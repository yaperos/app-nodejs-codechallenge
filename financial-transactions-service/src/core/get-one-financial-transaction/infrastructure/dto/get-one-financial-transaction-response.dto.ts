export interface GetOneFinancialTransactionResponseDTO {
  readonly transactionExternalId: string;
  readonly transactionType: TransactionType;
  readonly transactionStatus: TransactionStatus;
  readonly value: number;
  readonly createdAt: Date;
}

export interface TransactionType {
  readonly name: string;
}

export interface TransactionStatus {
  readonly name: string;
}
