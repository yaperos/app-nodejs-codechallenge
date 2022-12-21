export class TransactionCreationResponsetDto {
  transactionExternalId: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  value: number;
  createdAt: Date;
}

interface TransactionType {
  name: string;
}

interface TransactionStatus {
  name: string;
}
