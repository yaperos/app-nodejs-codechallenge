import { TransactionStatusEnum } from "src/enums/transaction-status.enum";

export class RetrieveTransaction {
  transactionExternalId: string;
  transactionType: {
    name: string;
  };
  transactionStatus: {
    name: TransactionStatusEnum;
  };
  value: number;
  createdAt: Date = new Date();
}
