import { TransactionStatusEnum } from "@shared/contracts/enums";
import { IsEnum, IsString } from "class-validator";

export class TransactionValidatedDto {
  @IsString()
  readonly transactionExternalId: string;

  @IsEnum(TransactionStatusEnum)
  readonly transactionStatus: TransactionStatusEnum;
}