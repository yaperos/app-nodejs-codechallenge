import { TransactionStatusEnum } from "apps/transactions-api/src/transactions/enums/transaction-status.enum";

export class UpdateTransactionDto {
  readonly transactionExternalId: string;
  readonly transactionStatus: TransactionStatusEnum;
}