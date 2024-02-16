import { IsOptional, IsUUID, IsPositive, IsNumber } from "class-validator";

export default class CreateTransactionDto {
  @IsOptional()
  @IsUUID()
  accountExternalIdDebit?: string;

  @IsOptional()
  @IsUUID()
  accountExternalIdCredit?: string;

  @IsNumber()
  @IsPositive()
  value: number;
}
