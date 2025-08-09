import { TransactionStatusEnum } from "apps/transactions-api/src/transactions/enums/transaction-status.enum";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class TransactionDto {
  @Expose()
  readonly transactionExternalId: string;

  @Expose()
  readonly transactionTypeName: string;

  @Expose()
  readonly transactionStatus: TransactionStatusEnum;

  @Expose()
  readonly value: number;

  @Expose()
  readonly createdAt: Date;
}