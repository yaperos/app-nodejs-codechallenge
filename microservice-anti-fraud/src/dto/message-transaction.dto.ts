import { IsNotEmpty, IsString } from "class-validator";

export class MessageTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionExternalId: string;

  @IsString()
  @IsNotEmpty()
  value: number;
}