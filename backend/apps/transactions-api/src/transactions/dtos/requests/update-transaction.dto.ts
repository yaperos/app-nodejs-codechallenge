import { TransactionStatusEnum } from "apps/transactions-api/src/transactions/enums/transaction-status.enum";

export class UpdateTransactionDto {
  readonly externalId: string;
  readonly status: TransactionStatusEnum;
}