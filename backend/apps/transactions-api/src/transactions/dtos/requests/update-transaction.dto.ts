import { TransactionStatusEnum } from "@shared/contracts/enums/transaction-status.enum";

export class UpdateTransactionDto {
  readonly transactionExternalId: string;
  readonly transactionStatus: TransactionStatusEnum;
}