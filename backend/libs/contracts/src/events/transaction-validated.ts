import { TransactionStatusEnum } from "apps/transactions-api/src/transactions/enums/transaction-status.enum";
import { IsEnum, IsString } from "class-validator";

export class TransactionValidatedDto {
  @IsString()
  readonly transactionExternalId: string;

  @IsEnum(TransactionStatusEnum)
  readonly transactionStatus: TransactionStatusEnum;
}