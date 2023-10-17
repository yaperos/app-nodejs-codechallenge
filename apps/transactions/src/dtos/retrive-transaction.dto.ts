export class TransactionTypeDTO {
  name: string;
}

export class TransactionStatusDTO {
  name: string;
}

export class RetrievedTransactionDTO {
  transactionExternalId: string;
  transactionType: TransactionTypeDTO;
  transactionStatus: TransactionStatusDTO;
  value: number;
  createdAt: Date;
}
