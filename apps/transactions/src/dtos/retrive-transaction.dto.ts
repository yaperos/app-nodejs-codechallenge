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
  amount: number;
  createdAt: Date;
}
