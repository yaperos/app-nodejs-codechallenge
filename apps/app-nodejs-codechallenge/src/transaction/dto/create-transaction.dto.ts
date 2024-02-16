import {
  IsOptional,
  IsUUID,
  IsInt,
  IsPositive,
  IsNumber,
} from "class-validator";

export default class CreateTransactionDto {
  @IsOptional()
  @IsUUID()
  accountExternalIdDebit?: string;

  @IsOptional()
  @IsUUID()
  accountExternalIdCredit?: string;

  @IsInt()
  @IsPositive()
  transferTypeId: number;

  @IsNumber()
  @IsPositive()
  value: number;
}
