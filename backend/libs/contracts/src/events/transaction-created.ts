import { TransactionStatusEnum } from "apps/transactions-api/src/transactions/enums/transaction-status.enum";
import { IsDate, IsEnum, IsNumber, IsPositive, IsString } from "class-validator";

export class TransactionCreatedDto {
  @IsNumber()
  @IsPositive()
  readonly value: number;

  @IsDate()
  readonly createdAt: Date;

  @IsString()
  readonly transactionTypeName: string;

  @IsString()
  readonly transactionExternalId: string;

  @IsEnum(TransactionStatusEnum)
  readonly transactionStatus: TransactionStatusEnum;
}