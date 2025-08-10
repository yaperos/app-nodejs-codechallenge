import { TransactionStatusEnum } from "@shared/contracts/enums";
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