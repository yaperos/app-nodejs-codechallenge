export class TransferType {
  readonly name: string;
}

export class TransactionStatus {
  readonly name: string;
}

export class ShowTransactionDto {
  readonly transactionExternalId: string;
  readonly transactionType: TransferType;
  readonly transactionStatus: TransactionStatus;
  readonly value: number;
  readonly createdAt: Date;
}
